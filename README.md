해당 저장소는 웹을 만드는 파일을 저장하기 위해 만들어졌다.
해당 웹은 orpg를 즐길 수 있도록 만든 웹이다. 
해당 작업은 윈도우, visual studio code, nodejs, HeidiSQL을 통해 작업하였다.

---
## 설치 목록
해당 웹은 다음과 같은 모듈이 필요하다.

#### 1. node   
    node.js를 통해 서버를 구축하였다.
    (https://nodejs.org/en)에서 다운받는
#### 2. express
    요청과 응답처리를 하는데 사용하였다.
    npm install express
#### 3. ws
    채팅을 구현하는 데 사용하였다.
    npm install ws
#### 4. http

    HTTP요청, 응답을 관리한다.
    npm install http
#### 5. body-parser

    HTTP요청의 body를 추출하는 데 사용한다.
    npm install body-parser
#### 6. express-session

    세션관리를 하는 데 사용한다. 캐릭터를 생성하기 전 단계에서 사용하였다.
    npm install express-session
#### 7. cors

    다른 도메인에서 호스팅되는 리소스에 접근할 수 있도록 한다.
    npm install cors
#### 8. mysql

    node.js에서 mysql을 사용하기 위해 설치한다.
    npm install mysql
#### 터미널에서 npm install xxx로 설치할 것.

    또한 visual studio code의 Live Server을 설치하여 포트를 연다.
    
    또한 node.js를 통해 서버를 여는데 서버를 설명할 때 후술한다.


---
## 구성
    해당 웹은 로그인 페이지, 커뮤니티 페이지, 게임 페이지가  각각 폴더로 존재한다. 
    
    또한 서버 구성 목적으로 DBMS, server폴더가 존재한다.


---


## 로그인 및 회원가입
    회원가입을 하면 서버를 통해 db에 입력된다.
    
    로그인을 하면 정보를 바탕으로 db를 확인한다.
    
    로그인에서 세션에서 id를 통하여 닉네임을 주고받는다.

---
## 커뮤니티 페이지
    우측 상단에 login, logout, register가 존재한다.
    
    게시글 위에는 로그인한 유저의 닉네임이 표시된다.
    
    게시글 추가를 누르면 제목, 내용을 입력하고 추가된다. 삭제도 가능하다.
    
    다만 첫 번째 게시글은 삭제할 수 없는 게 맞다.

---
## 게임 페이지

    * 좌측은 캐릭터를 생성하거나, 캐릭터의 속성을 볼 수 있는 사이드바이다.
    
        버튼을 누르면 바가 나오는데, 캐릭터의 닉네임을 변경하거나, 속성을 추가할 수 있다. 이때 속성은 3개만 생성할 수 있다.
    
        캐릭터 생성을 누르면 알람과 함께 캐릭터를 생성한다. 캐릭터를 더블 클릭하면 정보를 알 수 있다.
    
    
    * 우측은 채팅창으로서, 캐릭터를 더블클릭하고 메시지를 전송하면 캐릭터 이름과 함께 메시지를 전송한다. 채팅은 실시간 구현이 되어있다.
    
        명령어를 구현하고 싶었지만 구현하지 않았다.
    
    * 상단은 쓰지 않는 기능이다.
        맵을 바꾸고 싶다면 하단의 파일을 선택하여 바꿀 수 있지만 개인의 창에만 바뀐다. 사실상 미구현이다.
    
    * 중앙은 필드이다.
        캐릭터을 드래그 앤 드랍으로 옮길수 있다. db에 좌표가 저장된다. 

---
## DBMS

    db는 자체적으로 만들지 않고 HeidiSQL을 통해서 테이블과 속성을 미리 입력해두었다. mysql 문법을 사용한다.
    
    해당 폴더에는 각각 charDBManager.js, postDBManager.js, userDBManager.js가 있다.
    
    기본 설정은 다음과 같이 되어 있다.
    
    host: '127.0.0.1',
    
    port: 3306,
    
    user: 'root',
    
    password: '',
    
    database: 'trpg_main_db'


#### charDBManager.js

    테이블은 charcters로 되어있고, name_ch, stat1, a, stat2, b, stat3, c, nowX, nowY의 9개의 열이 존재한다.
    
    스텟 이름과 값은 null이 가능하다.

#### postDBManager.js

    테이블은 post로 되어있고, title, contents, user_nm, post_id의 4개의 열이 존재한다.
    
    null값은 존재하지 않는다. 


#### userDBManager.js

    테이블은 userinfo로 되어있고, user_id, user_nm, user_pw, unique_num의 4개의 열이 존재한다.
    
    null값은 존재하지 않는다. 

---
## 서버
    터미널에서 
    
    cd/templates/server/ 
    
    node *.js (Charserver.js, Chatserver.js, postServer.js, Reigister.js)
    
    을 통해서 서버를 열 수 있다.

---
## 버그 및 수정사항

#### 로그인 문제: 
    
    커뮤니티를 사용할때 다른 곳에서 로그인한 후 사용중인 웹을 새로고침하면 다른 곳에서 로그인한 정보를 사용한다.
    
    게임에 여러명 입장은 가능하다.

#### 커뮤니티 문제: 


#### 게임 내부:

    새로고침 후 캐릭터를 클릭하면 좌표값에null값이 전달되는 경우가 있다. 서버가 꺼지지는 않는다.
    
    맵을 서버에 저장하지 않는다. 
    
    명령어를 구현하지 않았다.
    
    캐릭터를 옮기는 과정에서 새로고침 하지 않으면 다른 웹페이지에서 옮겨지지 않는다.
