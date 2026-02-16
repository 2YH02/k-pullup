import { useEffect, useRef, useState } from "react";

const DRAG_START_THRESHOLD = 12;
const VELOCITY_SNAP_THRESHOLD = 0.045;
const DIRECTIONAL_SNAP_OFFSET = 1.2;
const MAX_HEIGHT_EPSILON = 0.4;

interface SheetHeightStep {
  min: number;
  max: number;
  height: number;
}

interface SheetHeight {
  STEP_1: SheetHeightStep;
  STEP_2: SheetHeightStep;
  STEP_3: SheetHeightStep;
}

interface UseDrawerGestureParams {
  enabled: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  curHeight: number;
  sheetHeight: SheetHeight;
  setCurHeight: (height: number) => void;
}

const useDrawerGesture = ({
  enabled,
  containerRef,
  curHeight,
  sheetHeight,
  setCurHeight,
}: UseDrawerGestureParams) => {
  const rafIdRef = useRef<number | null>(null);
  const pendingHeightRef = useRef<number | null>(null);
  const currentHeightRef = useRef(curHeight);
  const isDraggingRef = useRef(false);
  const isDragCandidateRef = useRef(false);
  const dragPointerIdRef = useRef<number | null>(null);
  const dragTouchIdRef = useRef<number | null>(null);
  const dragStartYRef = useRef(0);
  const dragStartXRef = useRef(0);
  const dragStartHeightRef = useRef(0);
  const dragCurrentHeightRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const lastMoveHeightRef = useRef(0);
  const velocityRef = useRef(0);

  const [isDrawerDragging, setIsDrawerDragging] = useState(false);

  const isDrawerAtMaxHeight = curHeight >= sheetHeight.STEP_3.height - MAX_HEIGHT_EPSILON;
  const canScrollContent = !enabled || (isDrawerAtMaxHeight && !isDrawerDragging);

  const snapPoints = [
    sheetHeight.STEP_1.height,
    sheetHeight.STEP_2.height,
    sheetHeight.STEP_3.height,
  ];

  useEffect(() => {
    currentHeightRef.current = curHeight;
  }, [curHeight]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const clampHeight = (height: number) => {
    if (height >= sheetHeight.STEP_3.height) return sheetHeight.STEP_3.height;
    if (height <= sheetHeight.STEP_1.height) return sheetHeight.STEP_1.height;
    return height;
  };

  const queueHeightUpdate = (height: number) => {
    pendingHeightRef.current = height;

    if (rafIdRef.current !== null) return;

    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = null;

      if (pendingHeightRef.current === null) return;

      setCurHeight(pendingHeightRef.current);
      pendingHeightRef.current = null;
    });
  };

  const clearQueuedHeightUpdate = () => {
    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    pendingHeightRef.current = null;
  };

  const getNearestSnapPoint = (height: number) => {
    return snapPoints.reduce((closest, point) => {
      if (Math.abs(point - height) < Math.abs(closest - height)) return point;
      return closest;
    }, snapPoints[0]);
  };

  const getDirectionalSnapPoint = (height: number, direction: "up" | "down") => {
    if (direction === "up") {
      const nextHigherPoint = snapPoints.find(
        (point) => point > height + DIRECTIONAL_SNAP_OFFSET
      );
      return nextHigherPoint ?? snapPoints[snapPoints.length - 1];
    }

    const reversePoints = [...snapPoints].reverse();
    const nextLowerPoint = reversePoints.find(
      (point) => point < height - DIRECTIONAL_SNAP_OFFSET
    );
    return nextLowerPoint ?? snapPoints[0];
  };

  const settleDrawerHeight = (height: number) => {
    clearQueuedHeightUpdate();

    const clampedHeight = clampHeight(height);
    const velocity = velocityRef.current;

    if (Math.abs(velocity) >= VELOCITY_SNAP_THRESHOLD) {
      const directionalTarget =
        velocity > 0
          ? getDirectionalSnapPoint(clampedHeight, "up")
          : getDirectionalSnapPoint(clampedHeight, "down");
      setCurHeight(directionalTarget);
      return;
    }

    setCurHeight(getNearestSnapPoint(clampedHeight));
  };

  const markDragCandidate = (clientX: number, clientY: number) => {
    isDragCandidateRef.current = true;
    dragStartYRef.current = clientY;
    dragStartXRef.current = clientX;
  };

  const resetDragCandidate = () => {
    isDragCandidateRef.current = false;
    dragPointerIdRef.current = null;
    dragTouchIdRef.current = null;
  };

  const rebaseDragStart = (clientX: number, clientY: number) => {
    dragStartYRef.current = clientY;
    dragStartXRef.current = clientX;
  };

  const beginDragSession = (clientX: number, clientY: number) => {
    if (!enabled) return;

    isDraggingRef.current = true;
    setIsDrawerDragging(true);
    isDragCandidateRef.current = false;
    dragStartYRef.current = clientY;
    dragStartXRef.current = clientX;
    dragStartHeightRef.current = currentHeightRef.current;
    dragCurrentHeightRef.current = currentHeightRef.current;
    lastMoveHeightRef.current = currentHeightRef.current;
    lastMoveTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const endDragSession = () => {
    if (isDraggingRef.current) {
      settleDrawerHeight(dragCurrentHeightRef.current);
    }

    isDraggingRef.current = false;
    setIsDrawerDragging(false);
    resetDragCandidate();
  };

  const updateDragSession = (clientY: number) => {
    if (!enabled || !isDraggingRef.current) return;

    const delta = dragStartYRef.current - clientY;
    const nextHeight = clampHeight(
      dragStartHeightRef.current + (delta / window.innerHeight) * 100
    );

    const now = performance.now();
    const elapsed = now - lastMoveTimeRef.current;
    if (elapsed > 0) {
      const instantVelocity = (nextHeight - lastMoveHeightRef.current) / elapsed;
      velocityRef.current = velocityRef.current * 0.65 + instantVelocity * 0.35;
      lastMoveTimeRef.current = now;
      lastMoveHeightRef.current = nextHeight;
    }

    dragCurrentHeightRef.current = nextHeight;
    queueHeightUpdate(nextHeight);
  };

  const handleContainerPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!enabled || e.pointerType === "touch") return;

    dragPointerIdRef.current = e.pointerId;
    markDragCandidate(e.clientX, e.clientY);
  };

  const handleContainerPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!enabled || e.pointerType === "touch") return;

    if (isDraggingRef.current) {
      e.preventDefault();
      if (dragPointerIdRef.current !== e.pointerId) return;
      updateDragSession(e.clientY);
      return;
    }

    if (!isDragCandidateRef.current || dragPointerIdRef.current !== e.pointerId) return;

    const deltaY = e.clientY - dragStartYRef.current;
    const deltaX = e.clientX - dragStartXRef.current;
    const currentScrollTop = containerRef.current?.scrollTop ?? 0;
    const isAtTop = currentScrollTop <= 0;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      resetDragCandidate();
      return;
    }

    if (!isAtTop) {
      rebaseDragStart(e.clientX, e.clientY);
      return;
    }

    if (deltaY > DRAG_START_THRESHOLD) {
      e.preventDefault();
      beginDragSession(e.clientX, e.clientY);
      dragPointerIdRef.current = e.pointerId;
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    if (deltaY < -DRAG_START_THRESHOLD) {
      resetDragCandidate();
    }
  };

  const handleContainerPointerEnd: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!enabled || e.pointerType === "touch") return;
    if (dragPointerIdRef.current !== e.pointerId) return;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    endDragSession();
  };

  const getTrackedTouch = (touches: React.TouchList) => {
    if (dragTouchIdRef.current === null) return null;

    for (let i = 0; i < touches.length; i += 1) {
      const touch = touches.item(i);
      if (touch?.identifier === dragTouchIdRef.current) return touch;
    }

    return null;
  };

  const handleContainerTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!enabled) return;

    const targetTouch = e.touches.item(0);
    if (!targetTouch) return;

    dragTouchIdRef.current = targetTouch.identifier;
    markDragCandidate(targetTouch.clientX, targetTouch.clientY);
  };

  const handleContainerTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!enabled) return;

    const targetTouch = getTrackedTouch(e.touches);
    if (!targetTouch) return;

    if (isDraggingRef.current) {
      updateDragSession(targetTouch.clientY);
      return;
    }

    if (!isDragCandidateRef.current) return;

    const deltaY = targetTouch.clientY - dragStartYRef.current;
    const deltaX = targetTouch.clientX - dragStartXRef.current;
    const currentScrollTop = containerRef.current?.scrollTop ?? 0;
    const isAtTop = currentScrollTop <= 0;
    const canExpandDrawer = currentHeightRef.current < sheetHeight.STEP_3.height - MAX_HEIGHT_EPSILON;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      resetDragCandidate();
      return;
    }

    if (deltaY < -DRAG_START_THRESHOLD && canExpandDrawer) {
      beginDragSession(targetTouch.clientX, targetTouch.clientY);
      return;
    }

    if (!isAtTop) {
      rebaseDragStart(targetTouch.clientX, targetTouch.clientY);
      return;
    }

    if (deltaY > DRAG_START_THRESHOLD) {
      beginDragSession(targetTouch.clientX, targetTouch.clientY);
      return;
    }

    if (deltaY < -DRAG_START_THRESHOLD) {
      resetDragCandidate();
    }
  };

  const handleContainerTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    if (!enabled) return;
    endDragSession();
  };

  const handleGrabberPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!enabled) return;

    e.preventDefault();
    e.stopPropagation();
    dragPointerIdRef.current = e.pointerId;
    beginDragSession(e.clientX, e.clientY);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleGrabberPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!enabled || !isDraggingRef.current) return;
    if (dragPointerIdRef.current !== e.pointerId) return;

    e.preventDefault();
    e.stopPropagation();
    updateDragSession(e.clientY);
  };

  const handleGrabberPointerEnd: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!enabled) return;
    if (dragPointerIdRef.current !== e.pointerId) return;

    e.stopPropagation();

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    endDragSession();
  };

  const handleGrabberTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!enabled) return;

    const targetTouch = e.touches.item(0);
    if (!targetTouch) return;

    dragTouchIdRef.current = targetTouch.identifier;
    beginDragSession(targetTouch.clientX, targetTouch.clientY);
  };

  const handleGrabberTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!enabled || !isDraggingRef.current) return;

    const targetTouch = getTrackedTouch(e.touches);
    if (!targetTouch) return;

    updateDragSession(targetTouch.clientY);
  };

  const handleGrabberTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    if (!enabled) return;
    endDragSession();
  };

  return {
    isDrawerDragging,
    canScrollContent,
    handleContainerPointerDown,
    handleContainerPointerMove,
    handleContainerPointerEnd,
    handleContainerTouchStart,
    handleContainerTouchMove,
    handleContainerTouchEnd,
    handleGrabberPointerDown,
    handleGrabberPointerMove,
    handleGrabberPointerEnd,
    handleGrabberTouchStart,
    handleGrabberTouchMove,
    handleGrabberTouchEnd,
  };
};

export default useDrawerGesture;
