---
id: tailwind docs
title: Tailwind CSS 문서 읽고 정리 내용
description: Tailwind CSS v4 문서 읽고 정리한 내용
---

# Tailwind CSS 사용기

Tailwind CSS를 싫어하다가 새로운 기능이 많이 나왔다고 해서 써보게 되었다. 공식 문서를 읽으면서 신기한 기능들을 정리해보았다. 내가 Tailwind CSS를 처음 썼던 3년 전에 비해 많이 달라진 듯해 새롭게 느낀 기능들만 정리한다.

## 클래스 결합

하나의 CSS 속성에 개입하는 tailwind 클래스가 여러 개 있을 수 있다. 따라서 tailwind는 이런 부분에 대해서 CSS 변수를 사용한다. `blur-sm grayscale`을 쓴다면 이런 식으로 변환된다.

```css
.blur-sm {
  --tw-blur: blur(var(--blur-sm));
  filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-grayscale,);
}
.grayscale {
  --tw-grayscale: grayscale(100%);
  filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-grayscale,);
}
```

이런 식으로 변환되기 때문에 `blur-sm`과 `grayscale`을 동시에 쓸 수 있다. `filter` 속성은 알아서 여러 개의 변수를 확인하고 결합해준다.

근데 일반적으로는 스타일시트 맨 마지막에 온 것만 적용되기 때문에 `?:` 등을 이용해서 진짜로 적용하고 싶은 하나만 적용되도록 하자. 즉 React 같은 거 쓸 때 커스텀 className 넣게 하지 말고 props로 넣어줘서 `className`을 조정해주는 게 좋다. 사용자가 extra className을 넣는 경우에는 충돌이 발생하기 너무 쉬워서...이걸 해결하려면 cva 같은 거 써야 할 거 같다.

물론 정 안되면 클래스명 끝에 `!`를 붙이면 강제로 적용할 수 있다. `!`를 붙이면 `!important`가 붙는다.

```html
<div class="bg-teal-500 bg-red-500!">
  <!-- ... -->
</div>
```

`@import "tailwindcss" important;` 처럼 써서 모든 tailwind CSS에 `!important`를 붙일 수도 있다. 이건 모든 기존 CSS를 tailwind로 바꿔야 할 때 써야 하는데 일반적으로는 안 쓰는 게 좋을 듯...

tailwind 클래스랑 충돌할지도 모르는 기존 클래스명이 있다면 이렇게 해서 tailwind에서 쓰는 클래스에 prefix를 붙여서 충돌을 피할 수 있다.

```css
@import "tailwindcss" prefix(tw);
```
이렇게 하면 tailwind CSS 클래스명과 변수명이 `tw-`로 바뀌게 된다. 예를 들어 `bg-red-500`은 `tw-bg-red-500`으로 바뀌게 된다. 물론 사용자는 그대로 쓸 수 있다. 컴파일된 css 결과에 prefix가 붙는 것이다.

## 부모, 형제 클래스

부모 클래스에 따라 자식 클래스의 스타일을 변경할 수 있다. 예를 들어 `group` 클래스를 부모에 추가하고, 자식에 `group-hover:bg-red-500`을 추가하면 부모가 hover 되었을 때 자식의 배경색이 빨간색으로 바뀐다.

```html
<a href="#" class="group rounded-lg p-8">
  <!-- ... -->
  <span class="group-hover:underline">Read more…</span>
</a>
```

`group-focus` 등 `group-*`등 여러 가지가 있다. 그리고 `group/{name}` 예를 들어 `group/item` 같은 형식으로 그룹 간에 구분할 수 있다. 해당 group의 상태에 대해 뭔가를 하려면 `group-hover/item` 같은 식으로 쓸 수 있다. 이건 `peer`도 비슷하게 `peer/{name}`으로 쓸 수 있다.

`group-`이랑 비슷한 `in-`도 있지만 이건 모든 부모에 대해 적용됨. 가령 `in-focus:~~`는 focus된 요소 내에 있다면 무조건 적용된다. 

형제 클래스에 따라 뭘 하려면 `peer` 클래스를 사용하면 된다. `peer`는 형제 요소에 적용할 수 있는 클래스다. 예를 들어 `peer-focus:bg-red-500`을 사용하면 형제가 focus 되었을 때 배경색이 빨간색으로 바뀐다.

## 커스텀 CSS

`@layer` 를 사용해서 커스텀 클래스 만들기 가능. 이렇게 하면 `btn-primary`라는 클래스를 만들 수 있다.

```css
@import "tailwindcss";
@layer components {
  .btn-primary {
    // ...
  }
}
```

## 상태에 따라서 스타일 변경하기

`:hover` 같은 상태에 따라서 스타일을 변경할 수 있다. 다크모드, `::after` 같은 가상 클래스도 지원. `nth-*`도 있고 암튼 웬만한 건 다 있다고 보면 됨

자식 요소 중에 뭐 있는지 보려면 `has-*`를 쓴다. 자식 중에 checked가 있는지, `img`태그가 있는지 등등...

## 반응형 디자인

Responsive design 문서 https://tailwindcss.com/docs/responsive-design

뷰포트 크기에 따른 반응형 디자인을 하려면 `md:`같은 식으로 쓴다. 부모 요소의 크기에 따라 반응형 디자인을 할 수도 있는데 이러면 기준이 되는 요소에 `@container` 클래스를 붙이고 자식에 `@md:` 같은 걸 붙이면 `@container`의 크기에 따라 반응형 디자인을 할 수 있다. 

`@container`에도 `group`처럼 이름을 붙일 수 있다. 예를 들어 `@container/item` 같은 식으로 쓸 수 있다. 그리고 `@md/item:--`처럼 쓰면 `@container/item`의 크기가 `md` 이상일 때 적용된다. 이렇게 하면 반응형에 쓰일 여러 컨테이너들에 중복 포함되는 요소가 있을 때 구분 가능하다.


tailwind는 mobile-first 접근 방식을 사용한다. 즉 작은 화면부터 시작해서 큰 화면으로 가는 방식이다. 그래서 `md:bg-red-500`은 `md` 너비 이상일 때 배경색이 빨간색이 된다. 모바일 화면/혹은 모든 화면 대상으로 스타일링할 때는 어떤 prefix도 붙이지 않으면 된다.

만약 어떤 화면 크기 범위에서만 스타일링을 적용하고 싶다면 max 너비도 줘야 한다. 이건 `max-sm`, `max-md` 등으로 쓸 수 있다. 예를 들어 `md:max-lg:bg-red-500`은 `md` 너비 이상 `lg` 너비 이하일 때 배경색이 빨간색이 된다.

이런 breakpoint는 css 파일에서 `--breakpoint-*` 변수를 설정하는 걸로 커스텀 가능하다. 예를 들어 `--breakpoint-sm`을 `500px`로 설정하면 `sm:--`은 너비가 `500px` 이상일 때 적용된다. `@theme`을 사용해서 설정한다. 테일윈드에서는 `rem` 단위를 사용하므로 breakpoint도 `rem` 단위로 설정해야 한다. 안 그러면 기본 값들과 충돌하여 예기치 않은 결과가 나올 수 있다.



## 다양한 state

aria 속성들을 기반으로 스타일링하려면 `aria-*`로 `aria-checked:~~`처럼 쓴다. 비슷하게 `data-*`도 있다. `data-` 속성들을 기반으로 스타일링할 수 있다.

요소가 비활성 상태임을 뜻하는 `inert`에 대해 스타일링할 수 있다. `inert:~~`처럼 쓴다.

모든 자식(단 direct child만) 요소에게 적용하고 싶은 스타일은 `*:~~`처럼 쓴다. 모든 후손 요소에게 적용하고 싶은 스타일은 `**:--`처럼 별을 두 개 써야 한다.

`[]`를 이용해서 커스텀 속성에 대해서도 스타일링 가능하다. 자기 자신은 `&`, 띄어쓰기는 `_`로 대체하면 된다. `[&_p]:style`처럼 쓰면 자기 자신의 후손 중 `p` 태그에 대해서 스타일을 적용할 수 있다. `& p`와 같은 의미다.

이런 띄어쓰기 대체는 속성을 임의 값으로 줄 때도 마찬가지다. `grid-cols-[1fr_500px_2fr]`처럼 쓸 수 있다. 그러면 테일윈드에서 알아서 빌드 시 띄어쓰기로 변환해 준다. 근데 만약 정말로 언더스코어를 넣고 싶은 경우가 있다. 그러면 `\_`로 이스케이프하면 된다. 이미지 URL 같은 경우에 이렇게 쓸 수 있따.

이런 게 반복되면 `@custom-variant` directive를 사용해서 커스텀 변형을 만들 수 있다.

```css
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

이렇게 하면 `theme-midnight:어쩌구`로 스타일링 가능

이런 건 다크모드에 대한 스타일링을 할 때도 유용하다. 가령 다크모드를 최상위 `<html>` 태그에 `data-theme="dark"`를 붙여서 다크모드로 바꾸고 싶다면 `@custom-variant`를 사용해서 다크모드에 대한 스타일링을 할 수 있다.

```css
@custom-variant dark (&:where([data-theme="dark"] *));
```
이렇게 하면 `dark:어쩌구`로 다크모드에 대한 스타일링을 할 수 있게 된다.

모든 상태의 레퍼런스 https://tailwindcss.com/docs/hover-focus-and-other-states#quick-reference

## Theme variables

https://tailwindcss.com/docs/theme

테일윈드의 디자인 토큰은 theme variable로 관리한다. 이건 `@theme` directive를 사용해서 설정한 css 변수들이다.

이 변수들의 namespace 목록 https://tailwindcss.com/docs/theme#theme-variable-namespaces

이런 namespace에 새로운 변수를 추가하면 해당하는 유틸리티 클래스들을 사용할 수 있게 된다. 예를 들어 `--color-mycolor`라는 변수를 추가하면 `text-mycolor`, `bg-mycolor` 같은 유틸리티 클래스를 사용할 수 있게 된다.

`@import tailwindcss`를 하면 이런 theme variable들의 기본값이 자동으로 사용된다. 컬러 팔레트, 폰트, 스페이싱 등등. 물론 이런 걸 커스텀할 수 있다. `@theme` directive를 사용해서 커스텀 변수를 추가하면 된다. namespace만 잘 맞춰 주면 됨

```css
@theme {
  --color-mycolor: #f00;
  --font-myfont: "My Font", sans-serif;
  --spacing-myspacing: 1rem;
}
```

물론 기본 variable 오버라이드도 가능. 이때 `initial`을 사용하면 기본값으로 초기화한다. `initial`은 tailwind CSS의 기본값조차 무시하고 없애 버림.

`@keyframes`를 사용해서 애니메이션을 만들고 `--animate-*` 변수에 애니메이션을 넣어주면 `animate-*` 클래스를 사용할 수 있다. 예를 들어 다음처럼 하면 `animate-midnight` 클래스를 사용할 수 있다.

```css
@theme {
  --animate-midnight: midnight 0.5s ease-in-out;

  @keyframes midnight {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-100%);
    }
  }
}
```

다른 theme variable을 사용하는 theme variable을 만들고 싶으면 `inline` 키워드 사용

```css
@theme inline {
  --font-sans: var(--font-inter);
}
```

커스텀 CSS에도 이런 theme variable을 사용할 수 있다. 커스텀 CSS에서 다 같은 값을 사용해야 하는 경우 유용함. 이런 식으로

```css
@layer components {
  .btn-primary {
    font-family: var(--font-sans);
  }
}
```

## 색상

색 관련 유틸리티 클래스, 예를 들어 배경색은 `bg-{color}`로 쓸 수 있다. 이 레퍼런스는 https://tailwindcss.com/docs/colors#using-color-utilities

색 투명도는 `클래스명/투명도`로 쓸 수 있다. 예를 들어 `bg-sky-500/10`은 `bg-sky-500` 색상에 투명도 10%를 적용한 것이다. 이건 10%단위로 있는데, 물론 `bg-sky-500/[23.5%]`처럼 `[]`를 이용해 임의 투명도를 적용할 수도 있다. 

## 임의의 값

`[]`를 사용해서 임의의 값을 넣을 수도 있다. `bg-[#000]`처럼. 그런데 `text-lg`, `text-black`처럼 같은 prefix인데 다른 속성을 설정하는 경우가 있다. tailwind는 이 경우 자동으로 구분해 주지만 정말 모호한 경우가 있다. `text-(--my-var)`같은 거

이 경우 css data type 힌트를 줄 수 있다. `text-(length:--my-var)`처럼 쓰면 `--my-var`이 길이 타입이라는 걸 tailwind에 알려준다.

그리고 커스텀 css 클래스를 따로 만드는 것도 전혀 문제가 없다.

## layer style

특정 HTML 요소의 base style을 설정할 수 있다. 이때 `@layer base`를 사용한다. 이건 reset css 같은 것이다.

```css
@layer base {
  h1 {
    font-size: var(--text-2xl);
  }
}
```

컴포넌트 스타일링을 위해 클래스 같은 걸 추가하려면 `@layer components`를 사용한다. 이렇게 하면 테일윈드의 유틸리티 클래스를 사용했을 때 테일윈드 클래스가 우선적으로 적용된다.

```css
@layer components {
  .btn-primary {
    ...
  }
}
```

tailwind variant 적용을 위해서는 `@variant` 사용. 이러면 tailwind의 variant를 이용해서 커스텀 CSS를 만들 수 있다. 예를 들어 `@variant hover`를 사용하면 hover 상태일 때 적용되는 CSS를 만들 수 있다.

```css
.btn-primary {
  @variant hover {
    background-color: var(--color-blue-500);
  }
}
```

`hover` 같은 건 실용성이 별로 없지만 `@variant dark` 같은 건 dark가 따로 정의되어 있을 때가 많아서 유용할 수 있다. 또한 `dark:hover:`같은 상태에 대해서 `@variant`를 중첩해 쓸 수 있어서 좋다. 이런 variant는 `@custom-variant`로 커스텀해서 추가도 가능

커스텀 유틸리티 클래스 추가를 위해서는 `@utility`를 사용한다. `@utility content-auto`처럼 쓰면 `content-auto`라는 유틸리티 클래스를 추가할 수 있다. https://tailwindcss.com/docs/adding-custom-styles#simple-utilities

이러면 `utilities` css layer에 추가된다.

## 추가사항

tailwind가 컨텐츠 파일에 없는 파일을 참고해야 한다면 이렇게 할 수 있다.

```css
@source inline("underline");
```

이건 중괄호를 이용해서 확장하는, `brace expansion`이라고 불리는 기능도 쓸 수 있다.(https://www.gnu.org/software/bash/manual/html_node/Brace-Expansion.html) 이를 이용하면 여러 클래스를 한번에 생성할 수도 있다. 공식 문서 예시는 이렇다.

```css
@source inline("{hover:,}bg-red-{50,{100..900..100},950}");
```

`@apply`는 내 커스텀 CSS에 tailwind의 유틸리티 클래스를 사용하고자 할 때 쓴다. tailwind에서 정의된 디자인 토큰을 이용해 css를 작성하고 싶을 때 유용하다.

```css
.class {
  @apply bg-red-500 text-white;
}
```

# 참고

Tailwind CSS docs, Styling with utility classes

https://tailwindcss.com/docs/styling-with-utility-classes