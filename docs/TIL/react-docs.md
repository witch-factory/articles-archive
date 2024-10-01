---
sidebar_position: 1
slug: react-docs-brief
title: React 공식 문서 요약
description: React 공식 문서의 각 섹션을 짧게 요약한 메모들
---

# React 공식 문서 요약

https://ko.react.dev/

React의 각 문서를 내가 아는 지식들을 빼고, 받을 수 있었던 새로운 부분과 인사이트만 더해 3~5항목으로 요약하는 것을 시도(세줄요약 하려 했는데 그건 너무 짧을지도 모르겠어서)

## Ref로 값 참조하기

- 렌더링에 필요한 값일 경우 ref를 쓰면 안됨
- 렌더링에도 쓰이는 값을 언제나 읽어야 하는 값일 경우(input의 값을 렌더링하는 동시에 특정 시점에 최신값을 읽어와야 하는 경우 등) state, ref를 동시에 관리할 수도 있다. 문서 4번째 챌린지

## Ref로 DOM 조작하기

- ref는 focus 등 리액트 외부의 기능과 연동할 때 사용하는 탈출구 중 하나
- ref를 태그에 props로 넘겨주면 리액트가 해당 노드 생성할 때 그 노드 참조를 ref.current에 넣는다.
- 태그의 ref 속성에 함수를 전달하여 노드 생성시 노드 참조를 인수로 하여 콜백이 호출되도록 하는 `ref callback` 패턴을 사용할 수 있다.(`ref={(node) => {node를 쓰는 함수 내용}}`) 실험적인 기능이지만 이 ref 콜백의 리턴은 클린업 함수로 쓸 수 있다(콜백의 호출내용 정리 etc.)
- 커스텀 컴포넌트의 노드에 접근할 수 있도록 하려면 forwardRef를 사용한다. 안 그러면 커스텀 컴포넌트의 ref는 null이 된다. 노출하고 싶은 기능 제한을 위해서는 useImperativeHandle을 사용한다.
- ref를 통한 DOM 조작과 react에서 관리하는 DOM 노드의 충돌을 주의한다

## Effect로 동기화하기

- useEffect는 렌더링 그 자체에 의해 발생하는 사이드 이펙트를 처리할 때 사용한다. useEffect는 매 렌더링 커밋 이후 실행된다(=렌더링 반영까지 코드 실행 지연시킴).
- useEffect 콜백 리턴값은 클린업 함수로 컴포넌트가 마운트 해제되기 전에 실행된다. 연결/구독을 해제하거나 정리하는, 혹은 모달을 닫는 등 Effect의 동작을 중단하거나 되돌리는 코드를 작성한다. 개발 모드에서는 effect -> cleanup -> effect 순으로 실행되는지 확인.

혹은 fetch 같은 경우 클린업 함수에서 되돌릴 수 없으니 `AbortController`(https://developer.mozilla.org/ko/docs/Web/API/AbortController)를 이용해 fetch를 중단하거나 ignore를 써서 결과 무시

```jsx
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    // ignore 덕분에 추가 fetch가 있어도 state에 영향을 주지 않는다.
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```


의존성 배열에 지정한 종속성 값들이 Effect 내부 코드 기반으로 리액트가 기대하는 거랑 다르면 린터 에러가 발생한다. 이때 종속성 배열을 변경할 수도 있지만 종속성 설계를 다시 검토해볼 수 있다(https://ko.react.dev/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)

ref 객체는 리액트에서 항상 같은 객체를 얻을 수 있음을 보장하기 때문에 ref 객체를 의존성 배열에 넣을 필요 없다. `useState`의 set 함수들도 참조 동일성을 유지한다. 안정된 식별성을 가진 의존성을 생략하는 것은 린터가 해당 객체가 안정적임을 “알 수” 있는 경우에 그렇다. 예를 들어, ref가 부모 컴포넌트에서 전달되었다면 부모가 항상 같은 ref를 전달하는지 알 수 없으므로 ref를 의존성 배열에 넣어야 한다.

## Effect가 필요하지 않을 수도 있습니다

effect를 이용하면 리액트를 벗어난 외부 시스템(네트워크 etc)과 동기화 가능. 하지만 외부 시스템이 관려하지 않을 경우 effect 안 써도 된다.

핵심은 렌더링 패스를 줄이고 이벤트를 위치해야 할 곳에 위치시키는 것. 렌더링이 끝나고 나서 또 useEffect에서 state를 바꿔서 렌더링을 다시 하게 되는 건 비효율적이다. 

state가 다른 state에서 계산될 수 있는 경우 그냥 그 값을 최상위에서 지역변수로 선언해서 렌더링 중에 계산되게 한다. 이 계산이 비싸면 useMemo를 사용한다.

이벤트 핸들러에 있어야 할 것은 사용자 이벤트 핸들러로 이동. "화면이 표시되는 그 자체에 의해 발생하는 사이드 이펙트"를 처리하는 것이 useEffect의 목적이다. 또는 외부 시스템과 동기화가 필요할 때 사용.

props 변경에 따라 state 초기화가 필요할 경우 key props를 사용. prop 변경시 전체 state가 아니라 일부 state를 조정하고 싶을 때는? `prevItems`같은 state를 하나 더 둬서 렌더링 중에 state를 조정되게 하고 Effect는 삭제.(`if (prevItems !== items) setItems(items)`)

물론 대부분의 경우 이 패턴이 필요하지 않다. 다른 props, state에 따라 state를 조정하는 건 데이터 흐름을 복잡하게 만든다. 패턴을 다르게 설계하는 걸 늘 고려하자.

> 컴포넌트가 사용자에게 표시되었기 때문에 실행되어야 하는 코드에만 Effect를 사용하세요.
> 로직이 특정 상호작용으로 발생하면 이벤트 핸들러에, 사용자가 화면에서 컴포넌트를 "보는 것"이 원인이면 Effect에 위치시키세요.

컴포넌트 마운트 시마다가 아니라, 앱이 로드될 때 한번만 실행되어야 하는 코드라면 최상위 전역 변수로 `didInit`등을 두거나 `if(typeof window !== 'undefined')`조건문 등으로 처리할 수 있다. 컴포넌트를 import 할 때 최상위 레벨의 코드는 렌더링 되지 않더라도 한 번 실행되므로 전체 초기화 조릭은 루트 같은 곳에 두자.

외부 저장소 구독을 하려고 할 시 useEffect보다는 이 목적으로 구현된 useSyncExternalStore 사용. 보통은 `useSyncExternalStore`를 넣은 커스텀 훅을 만들어서 코드 반복을 줄인다.

데이터 가져오기에서 race condition 방지를 위해서는 useEffect 내부에 `ignore` 추가. 이외에도 캐싱, 워터폴 방지 등 고려할 게 많다. 보통 `useData`같은 데이터 가져오기용 커스텀 훅을 쓰거나 프레임워크 내장 함수 사용.

> 일반적으로 Effect를 작성해야 할 때마다 위의 useData와 같이 보다 선언적이고 목적에 맞게 구축된 API를 사용하여 일부 기능을 커스텀 Hook으로 추출할 수 있는 경우를 주시하세요.

useEffect가 적을수록 유지보수 쉬워짐. 암튼 useEffect 최대한 줄이기! 지역 변수를 두든, 이벤트 핸들러로 로직을 옮기든, "화면에 컴포넌트 표시"가 아니라 다른 조건으로 실행하게 하든...
