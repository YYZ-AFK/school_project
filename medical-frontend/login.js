const API_BASE = "/api";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const roleHint = document.getElementById("roleHint");
const loginTip = document.getElementById("loginTip");
const loginButton = document.getElementById("loginButton");
const roleButtons = Array.from(document.querySelectorAll(".role-button"));

const roleConfig = {
    admin: {
        button: "管理员登录",
        hint: "管理员账号可进入系统管理功能",
        tip: "请使用管理员分配的账号和密码登录。",
        usernamePlaceholder: "请输入管理员账号"
    },
    doctor: {
        button: "医生登录",
        hint: "医生账号用于查询和维护个人相关业务",
        tip: "请使用医生账号登录；示例账号仅作格式参考：doctor001。",
        usernamePlaceholder: "例如：doctor001"
    }
};

function setLoginMessage(text, ok = false) {
    loginMessage.textContent = text || "";
    loginMessage.style.color = ok ? "#237b7b" : "#b44735";
}

function setRole(role) {
    const config = roleConfig[role] || roleConfig.admin;
    roleButtons.forEach((button) => {
        const active = button.dataset.role === role;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
    });
    roleHint.textContent = config.hint;
    loginTip.textContent = config.tip;
    loginButton.textContent = config.button;
    usernameInput.value = "";
    passwordInput.value = "";
    usernameInput.placeholder = config.usernamePlaceholder;
    passwordInput.placeholder = "请输入密码";
    setLoginMessage("");
    usernameInput.focus();
}

roleButtons.forEach((button) => {
    button.addEventListener("click", () => setRole(button.dataset.role));
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setLoginMessage("登录中...", true);

    const payload = {
        username: usernameInput.value.trim(),
        password: passwordInput.value
    };

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok || data.code !== 20000) {
            throw new Error(data.mess || "登录失败");
        }
        localStorage.setItem("medical-token", data.data.token);
        localStorage.setItem("medical-user", JSON.stringify(data.data.userInfo || {}));
        setLoginMessage("登录成功，正在进入系统...", true);
        window.location.href = "./dashboard.html";
    } catch (error) {
        setLoginMessage(error.message);
    }
});
