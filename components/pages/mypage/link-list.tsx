import Section from "@common/section";
import ShadowBox from "@common/shadow-box";
import Text from "@common/text";
import Link from "next/link";

const LinkList = () => {
  return (
    <Section className="flex flex-col">
      <Link href="/mypage/bookmark">
        <ShadowBox className="flex items-center p-4 mb-4" withAction>
          <div className="mr-10">
            <BookmarkIcon />
          </div>
          <Text fontWeight="bold">저장한 장소</Text>
        </ShadowBox>
      </Link>

      <Link href="/mypage/locate">
        <ShadowBox className="flex items-center p-4 mb-4" withAction>
          <div className="mr-10">
            <MylocateIcon />
          </div>
          <Text fontWeight="bold">등록한 장소</Text>
        </ShadowBox>
      </Link>

      <Link href="/mypage/report">
        <ShadowBox className="flex items-center p-4 mb-4" withAction>
          <div className="mr-10">
            <Proposal />
          </div>
          <Text fontWeight="bold">정보 수정 요청 목록</Text>
        </ShadowBox>
      </Link>

      <Link href="/mypage/myreport">
        <ShadowBox className="flex items-center p-4" withAction>
          <div className="mr-10">
            <Received />
          </div>
          <Text fontWeight="bold">받은 정보 수정 요청 목록</Text>
        </ShadowBox>
      </Link>
    </Section>
  );
};

const MylocateIcon = () => {
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 512 512"
      width={40}
      height={40}
    >
      <path
        d="M230.5 57.2c12.5-12.5 29.1-19.4 46.8-19.4 17.7 0 34.3 6.9 46.8 19.4 25.8 25.8 25.8 67.8 0 93.6l-46.8 46.8-46.8-46.8c-25.8-25.8-25.8-67.7 0-93.6z"
        fill="#f29992"
      ></path>
      <path d="M84.8 142.2h74.9v113.7H84.8z" fill="#f9b4ab"></path>
      <path
        d="M77.3 372.8h7.5-15v42H22.5V89.1h47.3v238.7h15-7.5z"
        fill="#f29992"
      ></path>
      <path d="M489.5 414.8h-94.7v-25.1h26.3v-32.5h68.4z" fill="#f9b4ab"></path>
      <path
        d="M489.5 263.4v78.8h-83.4v32.5h-26.3v40.1h-85.6v-98.9h-15v98.9h-14.5v-72.6h-29.5v-71.3h209.3v-7.5z"
        fill="#f29992"
      ></path>
      <path
        d="M437.2 67.9h67.3v15h-67.3zM407.2 67.9h15v15h-15zM145.4 474.1h67.3v15h-67.3zM115.4 474.1h15v15h-15z"
        fill="#0a557f"
      ></path>
      <circle
        cx="277.3"
        cy="104.1"
        transform="matrix(.00658 -1 1 .00658 171.393 380.628)"
        r="21.2"
        fill="#ffffff"
      ></circle>
      <path
        d="M277.3 67.9c-20 0-36.2 16.2-36.2 36.2 0 20 16.2 36.2 36.2 36.2s36.2-16.2 36.2-36.2c0-20-16.3-36.2-36.2-36.2zm0 57.3c-11.7 0-21.2-9.5-21.2-21.2s9.5-21.2 21.2-21.2 21.2 9.5 21.2 21.2-9.5 21.2-21.2 21.2zM459.5 255.9h15v15h-15z"
        fill="#0a557f"
      ></path>
      <path d="M279.2 285.9h15v15h-15z" fill="#ffffff"></path>
      <path d="M69.8 342.8h15v15h-15z" fill="#0a557f"></path>
      <path
        d="M355.1 127.2c8.2-27.6 1.4-58.8-20.4-80.6-15.3-15.3-35.7-23.8-57.4-23.8s-42.1 8.4-57.4 23.8c-21.8 21.8-28.6 53-20.4 80.6H84.8V74.1H7.5v355.7h497V127.2H355.1zm-124.6-70c12.5-12.5 29.1-19.4 46.8-19.4s34.3 6.9 46.8 19.4c25.8 25.8 25.8 67.8 0 93.6l-46.8 46.8-46.8-46.8c-25.8-25.8-25.8-67.7 0-93.6zm-55.7 85h30.9c3.7 6.9 8.4 13.4 14.2 19.2l57.4 57.4 57.4-57.4c5.8-5.8 10.6-12.3 14.2-19.2h30.9v56.9h-30v56.8h-175V142.2zm-90 0h74.9v113.7H84.8V142.2zm164.9 272.6H84.8v-41.9h-15v41.9H22.5V89.1h47.3v238.8h15V271h135.3v86.3h29.5v57.5zm239.8 0h-94.7v-25h26.4v-32.5h68.4v57.5zm0-72.6h-83.4v32.5h-26.4v40h-85.5v-98.9h-15v98.9h-14.5v-72.5h-29.5v-71.3h209.3v-15h-79.8v-41.8h30v-71.9h94.7v200z"
        fill="#0a557f"
      ></path>
    </svg>
  );
};

const BookmarkIcon = () => {
  return (
    <svg
      enableBackground="new 0 0 75 75"
      id="Layer_1"
      version="1.1"
      viewBox="0 0 75 75"
      xmlns="http://www.w3.org/2000/svg"
      width={40}
      height={40}
    >
      <g>
        <g>
          <rect
            fill="#1BC1A9"
            height="52.303"
            width="44.154"
            x="15.423"
            y="16.396"
          />
          <rect
            fill="#0CAFAF"
            height="52.303"
            width="29.693"
            x="15.423"
            y="16.396"
          />
          <g>
            <g>
              <g>
                <path
                  d="M47.556,39.243c-0.176-0.541-0.645-0.936-1.209-1.02l-5.186-0.752l-2.318-4.697       c-0.504-1.023-2.18-1.023-2.686,0l-2.318,4.697l-5.186,0.752c-0.562,0.084-1.033,0.479-1.207,1.02       c-0.178,0.543-0.029,1.137,0.379,1.537l3.752,3.656l-0.887,5.162c-0.096,0.561,0.135,1.131,0.596,1.465       c0.463,0.336,1.072,0.381,1.578,0.115l4.637-2.439l4.637,2.439c0.219,0.113,0.457,0.17,0.697,0.17       c0.309,0,0.617-0.096,0.879-0.285c0.461-0.334,0.693-0.904,0.596-1.465l-0.885-5.162l3.752-3.656       C47.585,40.38,47.731,39.786,47.556,39.243z"
                  fill="#ED9015"
                />
                <path
                  d="M36.157,32.774l-2.318,4.697l-5.186,0.752c-0.562,0.084-1.033,0.479-1.207,1.02       c-0.178,0.543-0.029,1.137,0.379,1.537l3.752,3.656l-0.887,5.162c-0.096,0.561,0.135,1.131,0.596,1.465       c0.463,0.336,1.072,0.381,1.578,0.115l4.637-2.439V32.007C36.956,32.007,36.409,32.263,36.157,32.774z"
                  fill="#EAB818"
                />
                <path
                  d="M43.429,44.462l-0.004-0.025l3.752-3.656c0.408-0.4,0.555-0.994,0.379-1.537       c-0.176-0.541-0.645-0.936-1.209-1.02l-5.186-0.752l-2.318-4.697c-0.504-1.023-2.18-1.023-2.686,0l-2.318,4.697l-0.033,0.004       L43.429,44.462z"
                  fill="#F26606"
                />
                <path
                  d="M37.501,40.159v-8.152c-0.545,0-1.09,0.256-1.344,0.768l-2.318,4.697l-0.033,0.004L37.501,40.159z"
                  fill="#ED9015"
                />
              </g>
            </g>
            <g>
              <g>
                <g>
                  <g>
                    <path
                      d="M37.501,29.819c-0.617,0-1.117-0.5-1.117-1.115v-1.396c0-0.615,0.5-1.115,1.117-1.115         c0.615,0,1.115,0.5,1.115,1.115v1.396C38.616,29.319,38.116,29.819,37.501,29.819z"
                      fill="#ED9015"
                    />
                  </g>
                  <g>
                    <path
                      d="M37.501,58.903c-0.617,0-1.117-0.5-1.117-1.117v-1.395c0-0.615,0.5-1.115,1.117-1.115         c0.615,0,1.115,0.5,1.115,1.115v1.395C38.616,58.403,38.116,58.903,37.501,58.903z"
                      fill="#ED9015"
                    />
                  </g>
                </g>
              </g>
              <g>
                <g>
                  <g>
                    <path
                      d="M46.501,33.548c-0.436-0.436-0.436-1.143,0-1.578l0.986-0.986c0.436-0.438,1.143-0.438,1.578,0         c0.436,0.436,0.436,1.141,0,1.578l-0.986,0.986C47.644,33.983,46.937,33.983,46.501,33.548z"
                      fill="#ED9015"
                    />
                  </g>
                  <g>
                    <path
                      d="M25.935,54.112c-0.436-0.436-0.436-1.143,0-1.578l0.986-0.986c0.436-0.436,1.143-0.436,1.578,0         s0.436,1.143,0,1.58l-0.986,0.984C27.077,54.548,26.37,54.548,25.935,54.112z"
                      fill="#ED9015"
                    />
                  </g>
                </g>
              </g>
              <g>
                <g>
                  <g>
                    <path
                      d="M50.228,42.548c0.002-0.617,0.5-1.117,1.117-1.117h1.395c0.617,0,1.115,0.502,1.115,1.117         c0.002,0.617-0.498,1.115-1.115,1.115h-1.395C50.728,43.663,50.228,43.163,50.228,42.548z"
                      fill="#ED9015"
                    />
                  </g>
                  <g>
                    <path
                      d="M21.146,42.548c-0.002-0.617,0.5-1.117,1.115-1.117h1.395c0.617,0,1.117,0.502,1.117,1.117         c-0.002,0.617-0.5,1.115-1.117,1.115h-1.395C21.646,43.663,21.146,43.163,21.146,42.548z"
                      fill="#ED9015"
                    />
                  </g>
                </g>
              </g>
              <g>
                <g>
                  <g>
                    <path
                      d="M46.501,51.548c0.436-0.436,1.143-0.436,1.578,0l0.986,0.986c0.436,0.436,0.436,1.143,0,1.578         s-1.143,0.436-1.578,0l-0.986-0.984C46.065,52.69,46.065,51.983,46.501,51.548z"
                      fill="#ED9015"
                    />
                  </g>
                  <g>
                    <path
                      d="M25.935,30.983c0.436-0.438,1.143-0.438,1.578,0l0.986,0.986c0.436,0.436,0.436,1.143,0,1.578         s-1.143,0.436-1.578,0l-0.986-0.986C25.499,32.124,25.499,31.419,25.935,30.983z"
                      fill="#ED9015"
                    />
                  </g>
                </g>
              </g>
            </g>
          </g>
          <polygon
            fill="#0C597A"
            points="44.722,6.302 15.423,16.396 44.722,16.396   "
          />
          <polygon
            fill="#094C63"
            points="44.722,16.396 44.722,11.349 30.071,16.396   "
          />
        </g>
      </g>
    </svg>
  );
};

export const Received = ({ size = 40 }: { size?: number }) => {
  return (
    <svg
      data-name="Layer 1"
      id="Layer_1"
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
    >
      <circle className="fill-[#88a451]" cx="217.44" cy="282.56" r="206.7" />
      <path
        className="fill-[#cececd]"
        d="M363.6,136.4a209,209,0,0,1,20.53,23.88l18.52-18.52a31.39,31.39,0,0,0,0-44.41h0a31.39,31.39,0,0,0-44.41,0l-18.52,18.52A209,209,0,0,1,363.6,136.4Z"
      />
      <path
        className="opacity-15"
        d="M402.65,97.35h0a31,31,0,0,0-11.44-7.21,31.19,31.19,0,0,1-9,24.38L363.7,133l-2,1.53c.62.61,1.25,1.21,1.86,1.83a209,209,0,0,1,20.53,23.88l18.52-18.52A31.39,31.39,0,0,0,402.65,97.35Z"
      />
      <path
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        d="M406,137.73A64.85,64.85,0,1,0,362.28,94"
      />
      <circle className="fill-[#f8e6c5]" cx="217.44" cy="282.56" r="153.43" />
      <path
        className="opacity-15"
        d="M363.6,136.4a205.8,205.8,0,0,0-66.89-44.76C362.23,172.81,357.3,292,281.87,367.43c-60.94,60.95-150.47,75.84-225.43,44.76a208.86,208.86,0,0,0,14.84,16.53c80.72,80.73,211.6,80.73,292.32,0S444.32,217.12,363.6,136.4Z"
      />
      <polygon
        className="fill-white"
        points="217.44 193.66 177.29 282.56 217.44 282.56 257.59 282.56 217.44 193.66"
      />
      <polygon
        className="fill-[#ee3734]"
        points="217.44 371.46 177.29 282.56 217.44 282.56 257.59 282.56 217.44 371.46"
      />
      <line
        className="fill-none stroke-[#2f2f31] stroke-linecap-round stroke-linejoin-round stroke-[20.43px]"
        x1="325.93"
        x2="303"
        y1="174.07"
        y2="197"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="325.93"
        x2="303"
        y1="174.07"
        y2="197"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="108.94"
        x2="131.88"
        y1="391.06"
        y2="368.12"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="325.93"
        x2="303"
        y1="391.06"
        y2="368.12"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="108.94"
        x2="131.88"
        y1="174.07"
        y2="197"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="217.44"
        x2="217.44"
        y1="436"
        y2="403.56"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="217.44"
        x2="217.44"
        y1="129.13"
        y2="161.56"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="64"
        x2="96.44"
        y1="282.56"
        y2="282.56"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="370.87"
        x2="338.44"
        y1="282.56"
        y2="282.56"
      />
      <circle
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        cx="217.44"
        cy="282.56"
        r="206.7"
      />
      <path
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        d="M363.6,136.4a209,209,0,0,1,20.53,23.88l18.52-18.52a31.39,31.39,0,0,0,0-44.41h0a31.39,31.39,0,0,0-44.41,0l-18.52,18.52A209,209,0,0,1,363.6,136.4Z"
      />
      <circle
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        cx="217.44"
        cy="282.56"
        r="153.43"
      />
      <polygon
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        points="217.44 193.66 177.29 282.56 217.44 282.56 257.59 282.56 217.44 193.66"
      />
      <polygon
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        points="217.44 371.46 177.29 282.56 217.44 282.56 257.59 282.56 217.44 371.46"
      />
    </svg>
  );
};

const Proposal = () => {
  return (
    <svg
      data-name="Layer 1"
      id="Layer_1"
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      width={40}
      height={40}
    >
      <polygon
        className="fill-[#f8e6c5]"
        points="369.64 48.91 489.27 80.71 489.27 451.09 369.64 419.29 369.64 48.91"
      />
      <polygon
        className="fill-[#f8e6c5]"
        points="130.36 48.91 250 80.71 250 451.09 130.36 419.29 130.36 48.91"
      />
      <polygon
        className="opacity-20"
        points="369.64 48.91 489.27 80.71 489.27 451.09 369.64 419.29 369.64 48.91"
      />
      <polygon
        className="opacity-20"
        points="130.36 48.91 250 80.71 250 451.09 130.36 419.29 130.36 48.91"
      />
      <polygon
        className="fill-[#f8e6c5]"
        points="369.64 48.91 250 80.71 250 451.09 369.64 419.29 369.64 48.91"
      />
      <polygon
        className="fill-[#f8e6c5]"
        points="130.36 48.91 10.73 80.71 10.73 451.09 130.36 419.29 130.36 48.91"
      />
      <line
        className="fill-[#fff] stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="82.67"
        x2="48.1"
        y1="138.55"
        y2="173.12"
      />
      <line
        className="fill-[#fff] stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="82.67"
        x2="48.1"
        y1="173.12"
        y2="138.55"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="63.75"
        x2="74.07"
        y1="157.55"
        y2="157.55"
      />
      <path
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px] stroke-dasharray-[20.82_34.69]"
        d="M108.76,157.55H285.45a45,45,0,0,1,45,45h0a45,45,0,0,1-45,45H219.12a41.86,41.86,0,0,0-41.85,41.86h0a41.85,41.85,0,0,0,41.85,41.85H407.59"
      />
      <line
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="424.94"
        x2="435.26"
        y1="331.27"
        y2="331.27"
      />
      <line
        className="fill-[#fff] stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="445.66"
        x2="411.1"
        y1="313.98"
        y2="348.55"
      />
      <line
        className="fill-[#fff] stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        x1="445.66"
        x2="411.1"
        y1="348.55"
        y2="313.98"
      />
      <polygon
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        points="369.64 48.91 489.27 80.71 489.27 451.09 369.64 419.29 369.64 48.91"
      />
      <polygon
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        points="369.64 48.91 250 80.71 250 451.09 369.64 419.29 369.64 48.91"
      />
      <polygon
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        points="130.36 48.91 10.73 80.71 10.73 451.09 130.36 419.29 130.36 48.91"
      />
      <polygon
        className="fill-none stroke-black stroke-linecap-round stroke-linejoin-round stroke-[20px]"
        points="130.36 48.91 250 80.71 250 451.09 130.36 419.29 130.36 48.91"
      />
    </svg>
  );
};

export default LinkList;
