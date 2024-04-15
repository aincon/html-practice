document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // 기본 제출 행동 방지

        // 닉네임 필드
        const usernameField = document.getElementById("username");
        const usernameValue = usernameField.value.trim();

        // 비밀번호 필드
        const passwordField = document.getElementById("password");
        const passwordValue = passwordField.value;

        // 비밀번호 확인 필드
        const passwordConfirmationField = document.getElementById("passwordConfirmation");
        const passwordConfirmationValue = passwordConfirmationField.value;

        // 각 필드의 유효성을 확인합니다.
        if (usernameValue === "") {
            alert("닉네임을 입력하세요.");
            return;
        }

        if (passwordValue === "") {
            alert("비밀번호를 입력하세요.");
            return;
        }

        if (passwordValue !== passwordConfirmationValue) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        // JSON 형식으로 데이터 생성
        const formData = {
            username: usernameValue,
            password: passwordValue,
            passwordConfirmation: passwordConfirmationValue
        };

        // 서버로 데이터를 전송합니다.
        fetch("/submit.txt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("서버 응답 오류");
            }
            return response.json();
        })
        .then(data => {
            console.log("서버 응답:", data);
            // 서버 응답에 따라 추가적인 작업을 수행할 수 있습니다.
        })
        .catch(error => {
            console.error("오류 발생:", error);
        });
    });
});
