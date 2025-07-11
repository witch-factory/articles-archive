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

## 반응형 effects의 생명주기

컴포넌트는 화면에 마운트되고, 중간중간 props나 state에 따라 업데이트되고 최종적으로 마운트 해제된다. 하지만 effect는 이와 독립적이다. 동기화를 시작하고 중지할 뿐이다.

컴포넌트 관점에서 effect를 생명주기 이벤트 같은 걸로 생각하는 건 좋지 않다. "effect의 관점에서" 동기화를 어떻게 시작하고 중지할지만 생각하면 된다. useEffect는 1번째 인수 콜백으로 동기화를 시작하는 작업을 지정하고, 클린업 함수로 중지하는 작업을 지정하고 종속성 배열로 어떨 때 동기화를 다시 시작할지 지정할 뿐이다.

예를 들어 종속성이 빈 배열일 때는 물론 컴포넌트 마운트 시 1번만 effect가 실행된다. 하지만 그게 중요한 게 아니다. 컴포넌트 마운트 같은 걸 생각하지 말고 "동기화를 시작하는 작업을 지정"했다고 생각하자.

화면에 무엇이 표시되어야 하는지 설명하면 나머지는 리액트가 알아서 처리한다.

effect는 외부 시스템과의 동기화를 나타내므로 별도의 독립적인 동기화의 경우 effect를 분리해서 새로 만들자. 코드의 깔끔함보다는 의미적으로 별도의 프로세스인지 따지자.

재렌더링으로 인해 변경될 수 있는 컴포넌트 내의 모든 값(변수까지도)를 의존성 배열에 넣어야 한다. 컴포넌트 내의 모든 값은 반응형이다(다시 렌더링될 때 변경될 수 있다)! 재렌더링 결과 절대 변경되지 않는다면 이를 컴포넌트 외부로 옮김으로써 의존성 배열에서 제외할 수 있다.(절대 변경 안된다고 react에 알려주는 것)

반면 react의 렌더링 흐름 외부에서 변경 가능한, `ref.current`나 `location.pathname` 같은 값은 종속성이 될 수 없다.

주의점 https://ko.react.dev/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize

- effect가 여러 개의 독립적인 동기화를 하는 경우 분할
- [이벤트와 effect를 분리](https://ko.react.dev/learn/separating-events-from-effects)
- [객체와 함수를 종속성으로 사용하지 말고 불필요한 종속성 제거](https://ko.react.dev/learn/removing-effect-dependencies)

## Effect에서 이벤트 분리하기

코드를 이벤트 핸들러 vs Effect 어디에 넣어야 할지 고민이라면 "어떤 경우에 해당 코드가 실행되어야 하는지, 이벤트 때문인지 동기화를 유지하기 위해서인지"를 고민해보자.

컴포넌트 내의 props, state, 변수 즉 리렌더링될 때 변할 수 있는 값을 반응형 값이라고 한다.

- 이벤트 핸들러 로직은 반응형이 아니다. 변화에 반응하지 않고 반응형 값을 읽을 뿐이다.
- Effect에서 반응형 값을 읽는 경우, 해당 값이 바뀌었을 때 다시 동기화해야 한다는 뜻이므로 의존성으로 지정해야 한다.

그런데 바뀌었을 때 동기화를 재실행하고 싶지 않은 값을 Effect에서 사용하게 되는 경우도 있다. 예를 들어 채팅에 연결할 때 알림을 보여준다면, 알림 색상을 결정하기 위해 `theme`을 Effect 내부에서 사용할 수 있다.

theme은 당연히 컴포넌트 내부 반응형 값이다. 하지만 이걸 의존성으로 지정하고 싶지는 않을 것이다. theme을 변경하는 게 동기화를 다시 해야 한다는 뜻은 아니니까.

이런 비-반응형 로직을 effect에서 분리하기 위해 `useEffectEvent` 훅을 사용해 볼 수 있다(실험적 기능) https://ko.react.dev/learn/separating-events-from-effects#declaring-an-effect-event

useEffectEvent는 콜백을 받고, 콜백 내부 로직은 **반응형이 아니다**. 항상 props와 state의 최신 값을 "바라본다". useEffectEvent는 Effect의 반응성과, 반응형이어서는 안 되지만 Effect 내부에서 쓰이는 코드 간의 연결을 끊어준다.

이때 `useEffectEvent`를 쓴다고 해도 반응형 로직은 Effect에 남겨두는 게 좋다. 별도의 이벤트이기도 하고, 이는 비동기 로직이 있는 경우 특히 그렇다. 공식 문서의 예시는 이렇다.

```jsx
const onVisit = useEffectEvent(visitedUrl => {
  logVisit(visitedUrl, numberOfItems);
});

useEffect(() => {
  setTimeout(() => {
    onVisit(url);
  }, 5000); // 방문 기록을 지연시킴
}, [url]);
```

만약 onVisit에서 url을 인수로 받지 않고 내부에 url을 위치시켰다면 url은 최신 state를 바라보게 될 것이다. 하지만 logVisit을 찍어야 하는 url은 useEffect가 실행된 시점의 URL이다! 따라서 이렇게 visitedUrl을 인수로 받아서 사용하는 것이다.

EffectEvent는 effect 코드 중 반응형이 아닌 부분을 이벤트처럼 추출한 것. 따라서 반응형으로 동작해야 하는(예를 들어 이 값이 변할 때마다 뭔가 다시 실행해야 한다든가)코드는 effect event로 추출하면 안된다. 그런 건 effect에 둘 것.

경험상 Effect 이벤트는 사용자 관점에서 일어나는 일에 부합해야 한다. (공식문서 챌린지 3번째 참고)

EffectEvent 한계

- 해당 이벤트를 사용하는 Effect 바로 근처에 선언해야 한다.
- Effect 내부에서만 호출해야 한다.
- 다른 컴포넌트나 훅에 전달하면 안된다.

## Effect 의존성 제거하기

**useEffect는 본문으로 동기화 시작 방식을 지정, 클린업 함수로 동기화 중지방식 지정, 의존성 배열로 동기화 시작 조건(Effect에서 사용하는 모든 반응형 값 - 리렌더링 시 바뀔 수 있는 모든 값)을 지정한다.**

react의 각 렌더링은 snapshot이라는 걸 기억하자. 렌더링을 다시 하지 않으면 모든 값이 고정되어 있다. 이는 effect 의존성을 제대로 지정하지 않았을 때 생기는 문제. effect에 필요한 의존성이 제대로 지정 안됨 -> snapshot이 변하지 않음 -> effect가 제대로 동기화 안됨.

불필요한 의존성이 있으면 effect가 너무 자주 실행되거나 무한 루프가 생길 수 있다. 단 linter에 의하면, effect에서 사용하는 모든 값이 의존성 배열에 들어가는 게 강제된다. 따라서 의존성을 제거하기 위해서는 effect의 코드 혹은 코드에서 쓰이는 반응형 값 선언 방식부터 변경해야 한다.

Effect의 의존성 배열을 검토했을 때, 의존성 중 하나라도 변경되면 effect가 다시 실행되는 게 합리적이지 않을 수 있다.

- Effect가 아니라 이벤트 핸들러가 아닌가?
- 별도의 동기화 프로세스를 하나로 묶고 있지 않은가?
- [effect에서 일어나는 state 업데이트를 의존성 값을 사용하지 않고, 업데이터 콜백 함수를 이용하도록 변경할 수는 없는가?](https://ko.react.dev/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state) 그렇게 하면 effect의 의존성 배열에서 해당 state를 제거할 수 있다.
- 변경되었을 때 동기화를 다시 시작할 필요가 없는 값을 useEffectEvent로 옮길 수 없는가?(부모에서 받은 onReceive 같은 이벤트 핸들러에도 useEffectEvent 적용할 수 있다)
- 객체/함수는 렌더링 시마다 다시 생성되므로 effect 의존성으로 사용하지 않는 게 좋다. 객체/함수라면 effect 내부로 이동하거나 원시값을 추출하자.(구조 분해 할당 등)
`options`를 의존성으로 지정하는 대신 `const { roomId, serverUrl } = options;`처럼 해서 roomId, serverUrl을 의존성으로 지정하는 식이다. 이러면 `options`가 props이더라도 부모 객체가 리렌더링되면서 `options`가 다시 실행되어도 roomId, serverUrl은 불변이므로 동기화가 다시 되지 않는다! 굿.

**의존성 린터 억제는 하지 말자**

연습문제가 쓸만하다. state 업데이트를 콜백함수로 진행하기, useEffectEvent 사용하기, 객체나 함수를 의존성으로 사용하지 않기, props 구조 변경해서 의존성 줄이기 등을 연습 가능. 

## 커스텀 Hook으로 로직 재사용하기

반복되는 로직을 `use`로 시작하는 커스텀 훅으로 추출해서, 컴포넌트 내부에서 좀 더 선언적으로 코드를 작성할 수 있다. 브라우저 API나 외부 시스템과의 소통 등을 숨길 수 있다. 리액트 훅을 사용하는 로직을 공유하는 함수 같은 거라고 보면 됨.

리액트 훅은 컴포넌트, 아니면 다른 훅에서만 사용될 수 있다. 즉 반대로, 훅을 내부에서 사용할 때에만 함수를 훅으로 만들어야 한다.

커스텀 훅은 컴포넌트 리렌더링마다 다시 돌아간다. state 등도 다시 전달된다. 따라서 커스텀 훅은 언제나 최신 props, state를 쓸 수 있다.

커스텀 훅에서 이벤트 핸들러를 받는 경우 그걸 useEffect 의존성에 추가하려고 할 수 있는데 그 대신 useEffectEvent를 커스텀 훅 내부에서 사용할 수 있다. 이벤트 핸들러는 반응형 값이 아니니까 반응형 값에서 제거해 버려~

Effect는 외부 시스템과의 동기화나 react 이외의 API를 사용하는 등, 리액트에서 벗어나 무언가를 하기 위함이다. 따라서 커스텀 훅으로 이걸 감싸는 건 목적을 전달하고 데이터의 흐름을 알기 쉽게 해준다. 또한 effect를 숨겨서 다른 사람들이 불필요한 의존성을 추가하는 걸 막을 수 있다.

> 시간이 지나면 앱의 대부분 Effect들은 커스텀 Hook 안에 있을 겁니다. - 공식 문서

하지만 Effect가 필요한지 늘 생각하자.

커스텀 훅은 반복되는 구체적인 사용 사례를 추상화해 선언적인 코드를 짜도록 하는 데 집중해야 하고 useEffect를 감싸는 용도 혹은 생명주기 관리를 위한 용도로 쓰여선 안된다. 이름도 구체적으로 짓자.

> React 팀의 목표는 더 구체적인 문제에 더 구체적인 해결 방법을 제공해 앱에 있는 Effect의 숫자를 점차 최소한으로 줄이는 것입니다. - 공식 문서

따라서 react에서는 useSyncExternalStore 같은 훅을 계속 내고 있다. 그런데 이미 커스텀 훅을 쓰고 있었다면 이런 새로운 훅을 반영하는 것도 쉽다.

JS 외부와 소통 -> Effect -> 커스텀 훅으로 추출 -> 그 안에서 로직을 class로 작성하거나 암튼 뭐 추상화 더 할 수 있음. effect간의 조정이 더 많이 필요할수록(여러 애니메이션 연결 등) 이펙트 로직을 커스텀 훅으로 추출하는 게 좋다.

물론 CSS 애니메이션을 사용하는 등 effect를 제거하면 더좋다..