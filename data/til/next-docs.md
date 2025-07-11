# Next.js 문서를 읽자

## 2024.10.10

### Getting Started

Next.js는 풀스택 웹 애플리케이션을 만들기 위한 리액트 프레임워크. 번들링, 컴파일, 라우팅 등 React에 필요한 여러 추가 설정들을 자동 제공

메인 기능
- 페이지 기반 라우팅
- 렌더링
- 데이터 페칭
- 스타일링
- 최적화(Image 컴포넌트 등)
- TypeScript 지원

App router, Pages Router가 있는데 app router에서 서버 컴포넌트, 스트리밍 등 리액트 최신 기능을 사용 가능

React 복습을 위해 React Foundation 코스 제공 https://nextjs.org/learn/react-foundations

앱 라우터 공식 문서 https://nextjs.org/docs/app

이건 앱 라우터 기준으로 문서를 읽고 남기는 기록

### Installation

`create-next-app`을 사용해서 next 프로젝트를 생성 가능. 여러 옵션도 존재. [create next app 공식문서](https://nextjs.org/docs/app/api-reference/cli/create-next-app). src 폴더 사용은 옵션.

layout.tsx: 해당 라우트에 공통으로 적용될 레이아웃. 프로젝트 루트의 layout.tsx는 필수(만약 없으면 next dev로 개발서버 실행시 자동 생성됨)

page.tsx: 실제 페이지 컴포넌트. 라우트의 컨텐츠를 렌더링

> Pages router 시절에는 라우트 폴더의 index.tsx가 페이지 컨텐츠였고 글로벌 레이아웃으로 `_app.tsx`를 사용했음. 서버의 초기 응답으로는 `_document.tsx`를 사용했고.

이미지, 폰트같은 정적 애셋은 `public`에 보관. 이 폴더의 파일은 baseURL(`/`)로부터 참조 가능

### Project Structure

최상위 폴더
- src
  - app(app, pages는 프로젝트 루트에 위치할 수도 있음)
  - pages
- public

파일 이름 컨벤션
- `(folder)`로 라우트 그룹, `_`로 시작하는 파일은 라우트로 인식되지 않는 private 폴더
- `@`로 시작하는 패러렐 라우트
- `icon.png` 등으로 메타데이터 파일 지정 가능
- `sitemap.xml` 등이 사이트맵 파일로 자동 인식

이외의 파일 컨벤션 등은 [프로젝트 구조 공식 문서](https://nextjs.org/docs/getting-started/project-structure)에서 확인 가능

## 2024.10.21

### Routing Fundamentals

폴더 기반 라우팅을 한다. 각 폴더명이 URL 세그먼트가 되고 `/`를 사이에 두고 합쳐서 URL 경로 만듬. 폴더에 있는 `page.js` 파일이 페이지가 됨. 이때 `page.js`나 `route.js`가 있는 폴더만 라우트가 되기 때문에 라우트 목적이 아닌 다른 폴더도 `app`에 둘 수 있다.

nextjs 13부터는 app router. 서버 컴포넌트를 사용한다. 여기에 대해서는 rendering 파트 공식문서 참고

중첩 라우트에서 특정 동작을 하는 UI를 만들고 싶을 때 특별한 파일들을 제공

- layout
- page
- loading
- not-found
- error
- global-error
- route
- template
- default: parallel route의 fallback UI

렌더링할 때 위계는 다음과 같다. 이 반복은 라우트 트리에서 leaf 노드까지 계속된다.

- layout
- template
- error(React Error Boundary)
- loading(React Suspense)
- not-found(React Error Boundary)
- page 아니면 중첩 라우트의 layout

고급 라우팅 패턴. 기존에 구현하기 어려웠던 패턴들을 쉽게 구현 가능

- 2개 이상의 페이지를 동시에 보여주고 병렬적으로 네비게이트 가능한 병렬 라우트
- 다른 라우트의 맥락에서 라우트를 보여줄 수 있는 intercepting route

### Defining Routes

폴더 기반으로 라우팅을 만드는 것에 대한 간략 설명
보통 layout.js, page.js를 가장 널리 사용

### Pages

폴더 내에 `page.js`를 만들어서 페이지 만들기 가능. 거기서 export default된 컴포넌트가 렌더링되는 것
페이지는 기본적으로 서버 컴포넌트지만 클라 컴포넌트 사용 가능
페이지에서 데이터 페칭 가능(https://nextjs.org/docs/app/building-your-application/data-fetching)

### Pages and Layouts

layout.js는 같은 라우트 내에서 네비게이션 시 리렌더링 안된다. state도 보존
layout에서 데이터 페칭도 가능

만약 모든 라우트 세그먼트가 필요하다면 `useSelectedLayoutSegments`를 사용

layout과 달리 template(`template.js`로 선언 가능)는 리렌더링된다. 네비게이션에 따라 새로운 인스턴스 생성
- useEffect, useState 등에 의존하는 기능에 유용
- 각 탐색마다 fallback을 표시하는 등, 기존 프레임워크 동작을 바꾸려고 할 때 가능

페이지 메타데이터는 metadata API로 설정 가능. `metadata` 객체를 export하거나 `generateMetadata` 함수를 export
https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts