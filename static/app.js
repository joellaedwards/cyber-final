const phishingAnswers = {
    phishing_1: true,
    phishing_2: false,
    phishing_3: true,
    phishing_4: false
};

function setProgress(level) {
    const current = Number(localStorage.getItem("campProgress") || 0);
    if (level > current) {
        localStorage.setItem("campProgress", String(level));
    }
}

function getProgress() {
    return Number(localStorage.getItem("campProgress") || 0);
}

function getCookie(name) {
    const target = `${name}=`;
    const parts = document.cookie.split(";").map((part) => part.trim());
    for (const part of parts) {
        if (part.startsWith(target)) {
            return decodeURIComponent(part.slice(target.length));
        }
    }
    return "";
}

function ensureAccessCookie() {
    if (!getCookie("access")) {
        document.cookie = "access=denied; path=/";
    }
}

function handleLevel1() {
    const form = document.getElementById("level1-form");
    const feedback = document.getElementById("level1-feedback");
    if (!form || !feedback) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        let allCorrect = true;

        for (const [name, expected] of Object.entries(phishingAnswers)) {
            const actual = formData.get(name) === "on";
            if (actual !== expected) {
                allCorrect = false;
                break;
            }
        }

        if (allCorrect) {
            setProgress(1);
            feedback.textContent = "Nice catch. You spotted every phishing email. Heading to the forest trail...";
            feedback.classList.add("success");
            feedback.classList.remove("error");
            window.setTimeout(() => {
                window.location.href = "level2.html";
            }, 900);
            return;
        }

        feedback.textContent = "Not quite yet. A few messages still need another look.";
        feedback.classList.add("error");
        feedback.classList.remove("success");
    });
}

function guardLevel2() {
    if (getProgress() < 1) {
        window.location.href = "level1.html";
    }
}

function handleSecretTrail() {
    if (getProgress() < 1) {
        window.location.href = "level1.html";
        return;
    }
    setProgress(2);
    window.setTimeout(() => {
        window.location.replace("level3.html");
    }, 200);
}

function handleLevel3() {
    if (getProgress() < 2) {
        window.location.href = "level2.html";
        return;
    }

    ensureAccessCookie();
    if (getCookie("access") === "granted") {
        setProgress(3);
        window.location.replace("success.html");
    }
}

function handleSuccess() {
    if (getProgress() < 3) {
        ensureAccessCookie();
        if (getCookie("access") === "granted") {
            setProgress(3);
        } else {
            window.location.href = "level3.html";
            return;
        }
    }

    const resetButton = document.getElementById("reset-progress");
    if (!resetButton) {
        return;
    }

    resetButton.addEventListener("click", () => {
        localStorage.removeItem("campProgress");
        document.cookie = "access=denied; path=/; max-age=3600";
        window.location.href = "index.html";
    });
}

const page = document.body.dataset.page;

if (page === "level1") {
    handleLevel1();
} else if (page === "level2") {
    guardLevel2();
} else if (page === "secret") {
    handleSecretTrail();
} else if (page === "level3") {
    handleLevel3();
} else if (page === "success") {
    handleSuccess();
}
