
// href='#' 클릭: 최상단 이동 방지
$(document).ready(function () {
    $("a[href='#']").on("click", function (e) {
        e.preventDefault(); // 기본 동작(최상단 이동) 방지
    });
});

// gnb 스크롤 내릴 때 안보이고, 올릴 때 보이게 구현 
$(document).ready(function () {
    let lastScrollTop = 0; // 이전 스크롤 위치 저장
    const $header = $("header"); // 헤더 선택

    $(window).on("scroll", function () {
        const currentScrollTop = $(this).scrollTop(); // 현재 스크롤 위치 가져오기

        if (currentScrollTop > lastScrollTop) {
            // 스크롤 내릴 때
            $header.css("transform", "translateY(-100%)"); // 헤더 숨기기
        } else {
            // 스크롤 올릴 때
            $header.css("transform", "translateY(0)"); // 헤더 보이기
        }

        lastScrollTop = currentScrollTop; // 현재 스크롤 위치를 업데이트
    });
});


// 마우스 커서, 기본적으로 원으로 보이게 처리 & 포인터 일 때는 숨김처리!
$(document).ready(function () {
    const $cursor = $(".cursor"); // 검정 테두리
    const $cursorInner = $(".cursor-inner"); // 흰색 원

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    const delay = 0.1;

    // 마우스 움직임 이벤트
    $(document).on("mousemove", function (e) {
        mouseX = e.pageX;
        mouseY = e.pageY;

        // 검정 테두리 즉각 이동
        $cursor.css({
            left: mouseX - $cursor.width() / 2 + "px",
            top: mouseY - $cursor.height() / 2 + "px",
        });

        // 마우스 커서가 pointer 상태인지 확인
        const targetElement = document.elementFromPoint(e.clientX, e.clientY);
        const isPointer = window.getComputedStyle(targetElement).cursor === "pointer";

        // pointer 상태에 따라 hidden 클래스 추가/제거
        if (isPointer) {
            $cursor.addClass("hidden");
            $cursorInner.addClass("hidden");
        } else {
            $cursor.removeClass("hidden");
            $cursorInner.removeClass("hidden");
        }
    });

    // 흰색 원 부드럽게 이동
    function updateCursorInner() {
        cursorX += (mouseX - cursorX) * delay;
        cursorY += (mouseY - cursorY) * delay;

        $cursorInner.css({
            left: cursorX - $cursorInner.width() / 2 + "px",
            top: cursorY - $cursorInner.height() / 2 + "px",
        });

        requestAnimationFrame(updateCursorInner);
    }

    // 클릭 이벤트
    $(document).on("mousedown", function () {
        $cursor.addClass("active");
        $cursorInner.addClass("active");
    });

    $(document).on("mouseup", function () {
        $cursor.removeClass("active");
        $cursorInner.removeClass("active");
    });

    updateCursorInner();
});


// .dream-list a 호버시, .dream-youtube iframe 보여지고 자동재생
// <a> 요소에 hover 이벤트 추가
document.querySelectorAll(".dream-list li a").forEach((link) => {
    link.addEventListener("mouseenter", function () {
        const youtubeIframe = this.nextElementSibling.querySelector("iframe");
        const src = youtubeIframe.getAttribute("src");

        // hover 시 autoplay 파라미터 추가
        if (!src.includes("autoplay=1")) {
            youtubeIframe.setAttribute("src", src + "&autoplay=1");
        }
    });

    link.addEventListener("mouseleave", function () {
        const youtubeIframe = this.nextElementSibling.querySelector("iframe");
        const src = youtubeIframe.getAttribute("src");

        // hover 해제 시 autoplay 파라미터 제거 (선택 사항)
        if (src.includes("autoplay=1")) {
            youtubeIframe.setAttribute("src", src.replace("&autoplay=1", ""));
        }
    });
});





/* 
    GSAP
    curator-marquee / .masterpiecess-marquee-top 텍스트 왼쪽으로 이동
    .masterpiecess-marquee-bot 텍스트 오른쪽으로 이동 (삼항연산자 사용!) 
 */
// Load 이벤트 이후 텍스트의 크기를 정확히 계산하도록 설정
window.addEventListener("load", function () {
    const marqueeText = document.querySelectorAll(".curator-marquee-text, .masterpiecess-marquee-top-text, .masterpiecess-marquee-bot-text");

    marqueeText.forEach((text) => {
        const isBotMarquee = text.classList.contains("masterpiecess-marquee-bot-text");
        const width = text.offsetWidth; // 텍스트의 전체 너비 계산
        const parentWidth = text.parentElement.offsetWidth; // 부모 요소 너비 계산

        // 애니메이션 설정
        gsap.to(text, {
            x: isBotMarquee ? parentWidth : -width, // 방향: 위는 왼쪽, 아래는 오른쪽
            duration: 30, // 애니메이션 지속 시간 (조정 가능)
            repeat: -1, // 무한 반복
            ease: "none", // 일정한 속도로 움직임
            onUpdate: function () {
                // 텍스트가 부모 영역에서 벗어나면 위치 초기화
                const currentX = parseFloat(gsap.getProperty(text, "x"));
                if (isBotMarquee && currentX >= parentWidth) {
                    gsap.set(text, { x: -width });
                } else if (!isBotMarquee && currentX <= -width) {
                    gsap.set(text, { x: parentWidth });
                }
            },
        });
    });
});


// main-display 가로스크롤 자동 활성화
// GSAP와 ScrollTrigger 플러그인 활성화
gsap.registerPlugin(ScrollTrigger);

// main-display 스크롤 애니메이션 설정
gsap.to(".display-list", {
    x: () => -(document.querySelector(".display-list").scrollWidth - document.querySelector(".main-display").clientWidth), // 전체 스크롤 길이 계산
    ease: "none", // 부드러운 애니메이션
    scrollTrigger: {
        trigger: ".main-display", // 트리거 설정
        start: "top top", // 스크롤 시작 지점
        end: "+=3000", // 스크롤 길이 설정
        scrub: true, // 사용자의 스크롤에 따라 애니메이션 연동
        pin: true // main-display 영역 고정
    }
});


// main-masterpiecess 리스트 애니메이션 설정
gsap.fromTo(
    ".masterpiecess-list-top, .masterpiecess-list-center, .masterpiecess-list-bot",
    {
        scale: 0.5, // 작은 크기에서 시작
        opacity: 0, // 투명하게 시작
    },
    {
        scale: 1, // 원래 크기로 확장
        opacity: 1, // 완전히 보이게
        duration: 2, // 애니메이션 지속 시간
        ease: "power2.out", // 부드러운 애니메이션
        stagger: 0.5, // 리스트 간 시간 간격
        scrollTrigger: {
            trigger: ".main-masterpiecess", // 트리거 설정
            start: "top 80%", // 트리거 시작 지점
            end: "top 20%", // 트리거 종료 지점
            scrub: true, // 스크롤에 따라 애니메이션 연동
        },
    }
);


// 섹션들에 애니메이션 설정
[".main-artists", ".main-record", ".main-space", ".main-notice"].forEach((section) => {
    gsap.fromTo(
        section,
        {
            y: 100, // 아래에서 시작
            opacity: 0, // 투명하게 시작
        },
        {
            y: 0, // 제자리로 이동
            opacity: 1, // 완전히 보이게
            duration: 2.5, // 애니메이션 지속 시간
            ease: "power2.out", // 부드러운 애니메이션
            scrollTrigger: {
                trigger: section, // 각 섹션을 트리거로 설정
                start: "top 80%", // 섹션의 상단이 화면의 80% 지점에 도달하면 시작
                end: "top 50%", // 섹션의 상단이 화면의 50% 지점에 도달하면 종료
                scrub: true, // 스크롤과 애니메이션 연동
            },
        }
    );
});

// curator-did: 왼쪽에서 오른쪽으로 나타나도록 설정
gsap.fromTo(
    ".curator-did",
    {
        x: -200, // 왼쪽으로부터 시작
        opacity: 0, // 투명하게 시작
    },
    {
        x: 0, // 원래 위치로 이동
        opacity: 1, // 완전히 보이게
        duration: 1.5, // 애니메이션 지속 시간
        ease: "power2.out", // 부드러운 애니메이션 효과
        scrollTrigger: {
            trigger: ".main-curator", // 트리거 설정
            start: "top 80%", // 시작 지점
            end: "top 50%", // 종료 지점
            scrub: true, // 스크롤 연동
        },
    }
);

// curator-guide: 오른쪽에서 왼쪽으로 나타나도록 설정
gsap.fromTo(
    ".curator-guide",
    {
        x: 200, // 오른쪽으로부터 시작
        opacity: 0, // 투명하게 시작
    },
    {
        x: 0, // 원래 위치로 이동
        opacity: 1, // 완전히 보이게
        duration: 2.5, // 애니메이션 지속 시간
        ease: "power2.out", // 부드러운 애니메이션 효과
        scrollTrigger: {
            trigger: ".main-curator", // 트리거 설정
            start: "top 80%", // 시작 지점
            end: "top 50%", // 종료 지점
            scrub: true, // 스크롤 연동
        },
    }
);