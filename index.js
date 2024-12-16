

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

    if (targetElement) { // targetElement가 유효한 경우에만 실행
        const isPointer = window.getComputedStyle(targetElement).cursor === "pointer";

        // pointer 상태에 따라 hidden 클래스 추가/제거
        if (isPointer) {
            $cursor.addClass("hidden");
            $cursorInner.addClass("hidden");
        } else {
            $cursor.removeClass("hidden");
            $cursorInner.removeClass("hidden");
        }
    } else {
        // targetElement가 null인 경우 커서를 기본 상태로 설정
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


// .dream-list h2 호버 시, .dream-youtube iframe 보여지고 자동재생
$(document).ready(function () {
    $(".dream-list h2").hover(
        function () {
            // hover 시작 시
            const $iframe = $(this).closest("li").find(".dream-youtube iframe");
            const src = $iframe.attr("src");

            // autoplay=1이 없으면 추가
            if (!src.includes("autoplay=1")) {
                $iframe.attr("src", src + "&autoplay=1");
            }

            // iframe 보이기
            $iframe.css({
                display: "block",
                opacity: 1,
            });
        },
        function () {
            // hover 종료 시
            const $iframe = $(this).closest("li").find(".dream-youtube iframe");

            // iframe 숨기기
            $iframe.css({
                display: "none",
                opacity: 0,
            });
        }
    );
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


// main-artists ul(artists-list) li
$(function(){
    gsap.timeline({
        scrollTrigger:{
            trigger:'main .main-artists .artists-list',
            start:'top 80%',
            end:'20% 100%',
            scrub:3,
            // markers:true
        }
    })
    .fromTo('main .main-artists .artists-list li:nth-child(1)',{y:'200%'},{y:'0', duration:2.5, ease:'power1.inOut'}, 0.6)
    .fromTo('main .main-artists .artists-list li:nth-child(2)',{y:'200%'},{y:'0', duration:2.5, ease:'power1.inOut'}, 0.8)
    .fromTo('main .main-artists .artists-list li:nth-child(3)',{y:'200%'},{y:'0', duration:2.5, ease:'power1.inOut'}, 1.2)
    .fromTo('main .main-artists .artists-list li:nth-child(4)',{y:'200%'},{y:'0', duration:2.5, ease:'power1.inOut'}, 1.4)
    .fromTo('main .main-artists .artists-list li:nth-child(5)',{y:'200%'},{y:'0', duration:2.5, ease:'power1.inOut'}, 2.0)
    .fromTo('main .main-artists .artists-list li:nth-child(6)',{y:'200%'},{y:'0', duration:2.5, ease:'power1.inOut'}, 2.2)
    .fromTo('main .main-artists .artists-list li:nth-child(7)',{y:'200%'},{y:'0', duration:2.5, ease:'power1.inOut'}, 2.4)
    .fromTo('main .main-artists .artists-list li:nth-child(8)',{y:'200%'},{y:'0', duration:2.5, ease:'power1.inOut'}, 2.6)
});

// main .main-record .record-list li
$(function(){
    gsap.timeline({
        scrollTrigger:{
            trigger:'main .main-record .record-list',
            start:'top 80%',
            end:'20% 100%',
            scrub:3,
            // markers:true
        }
    })
    .fromTo('main .main-record .record-list li:first-child',{y:'200%', duration:2.5, ease:'power1.inOut'},{y:'0'}, 0.6)
    .fromTo('main .main-record .record-list li:last-child',{y:'200%', duration:2.5, ease:'power1.inOut'},{y:'0'}, 0.8)



});

// main .main-curator .curator-did , .curator-guide 
$(function(){
    gsap.timeline({
        scrollTrigger:{
            trigger:'main .main-curator',
            start:'top 90%',
            end:'20% 100%',
            scrub:4,
            // markers:true
        }
    })
    .fromTo('main .main-curator .curator-did',{ x: '200%', opacity: 0 },{ x: '0', opacity: 1, duration: 2.5, ease: 'power2.out'}, 0.6)
    .fromTo('main .main-curator .curator-guide',{ x: '-200%', opacity: 0 },{ x: '0', opacity: 1, duration: 2.5, ease: 'power2.out' }, 0.8)

});

//main .main-space ul li
$(function(){
    gsap.timeline({
        scrollTrigger:{
            trigger:'main .main-space ul',
            start:'top 90%',
            end:'20% 100%',
            scrub:5,
            // markers:true
        }
    })
    .fromTo(
        'main .main-space ul li:nth-child(1)', 
        { opacity: 0, scale: 0.8 }, // 초기 상태: 투명하고 작음
        { opacity: 1, scale: 1, duration: 2.5, ease: 'power1.inOut' }, // 나타나며 원래 크기로
        0.4
    )
    .fromTo(
        'main .main-space ul li:nth-child(2)', 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 2.5, ease: 'power1.inOut' },
        0.6
    )
    .fromTo(
        'main .main-space ul li:nth-child(3)', 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 2.5, ease: 'power1.inOut' },
        1.0
    )
    .fromTo(
        'main .main-space ul li:nth-child(4)', 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 2.5, ease: 'power1.inOut' },
        1.2
    );
    /*
    .fromTo('main .main-space ul li:nth-child(1)',{x:'200%',opacity:0,scale:0.8},{x:'0',opacity:1,scale:1,duration:2.5, ease:'power1.inOut'}, 0.4)
    .fromTo('main .main-space ul li:nth-child(2)',{x:'-200%',opacity:0,scale:0.8},{x:'0',opacity:1,scale:1, duration: 2.5, ease: 'power1.inOut' }, 0.6)
    .fromTo('main .main-space ul li:nth-child(3)',{x:'200%', opacity: 0,scale:0.8},{ x:'0',opacity:1,scale:1, duration: 2.5, ease: 'power1.inOut'}, 1.0)
    .fromTo('main .main-space ul li:nth-child(4)',{x:'-200%',opacity:0,scale:0.8},{x:'0',opacity:1,scale:1,duration:2.5, ease:'power1.inOut'}, 1.2)
    */
});

