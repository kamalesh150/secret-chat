// --- DOM Element Selection ---
const encryptionForm = document.querySelector("#encryption");
const decryptionForm = document.querySelector("#decryption");

const encBtnTab = document.querySelector("#enc-btn");
const decBtnTab = document.querySelector("#dec-btn");
const arrowImg = document.querySelector("#main>h1 span img");

const textInput = document.querySelector("#textmsg");
const passwordInput = document.querySelector("#password");

const emojiInput = document.querySelector("#emojimsg");
const finalPasswordInput = document.querySelector("#finalpassword");

const resultDiv = document.querySelector("#result");
const resultText = document.querySelector("#result-text");
const copyBtn = document.querySelector("#copy-btn");

// --- --------------------------------------------------- ---
// --- CHOOSE YOUR EMOJI THEME HERE! ---
// --- --------------------------------------------------- ---
// Just change the number below to change the style of emojis generated.
// Pick one from the options list.

const ENCRYPTION_OFFSET = 127744; // <-- CHANGE THIS NUMBER

// --- OFFSET OPTIONS (Copy a number from here) ---
// 128512: Smiley Faces & People 😀 😂 😍 🙏
// 127744: Animals, Food & Objects 🐼 🍔 🌙 🏆
// 128640: Transport & Signs 🚀 🚗 ⛽ ⚠️
// 129280: Modern Emojis & Symbols 🤯 🥰 🤖 🤫
// 127280: Cool Decorative Symbols 🅐 ➒ 🙠 ✧

const MAGIC_WORD = "pw_check::";

// --- Main Application Logic ---

function setupTabSwitching() {
    decBtnTab.addEventListener("click", function () {
        decryptionForm.style.display = "block";
        encryptionForm.style.display = "none";
        decBtnTab.style.backgroundColor = "#4F46E5";
        encBtnTab.style.backgroundColor = "#222";
        arrowImg.style.transform = 'rotate(270deg)';
        hideResult();
    });

    encBtnTab.addEventListener("click", function () {
        encryptionForm.style.display = "block";
        decryptionForm.style.display = "none";
        encBtnTab.style.backgroundColor = "#4F46E5";
        decBtnTab.style.backgroundColor = "#222";
        arrowImg.style.transform = 'rotate(90deg)';
        hideResult();
    });
}

function handleEncryption() {
    encryptionForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const message = textInput.value;
        const password = passwordInput.value;

        const dataToEncrypt = MAGIC_WORD + message;

        let encryptedString = "";
        for (let i = 0; i < dataToEncrypt.length; i++) {
            const dataCharCode = dataToEncrypt.charCodeAt(i);
            const passwordCharCode = password.charCodeAt(i % password.length);
            const xorCode = dataCharCode ^ passwordCharCode;
            // The offset is now controlled by the constant at the top
            encryptedString += String.fromCodePoint(xorCode + ENCRYPTION_OFFSET);
        }

        displayResult(encryptedString, "#eee", true);
        
        textInput.value = "";
        passwordInput.value = "";
    });
}

function handleDecryption() {
    decryptionForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const encryptedMessage = emojiInput.value;
        const password = finalPasswordInput.value;

        let decryptedData = "";
        let i = 0;
        try {
            for (const emoji of encryptedMessage) {
                // The offset is now controlled by the constant at the top
                const emojiCode = emoji.codePointAt(0) - ENCRYPTION_OFFSET;
                const passwordCharCode = password.charCodeAt(i % password.length);
                const originalCharCode = emojiCode ^ passwordCharCode;
                decryptedData += String.fromCharCode(originalCharCode);
                i++;
            }
        } catch (error) {
            displayResult("Invalid encrypted message format.", "red", false);
            return;
        }

        if (decryptedData.startsWith(MAGIC_WORD)) {
            const originalMessage = decryptedData.substring(MAGIC_WORD.length);
            displayResult(originalMessage, "#eee", true);
        } else {
            displayResult("Invalid password.", "red", false);
        }
        
        emojiInput.value = "";
        finalPasswordInput.value = "";
    });
}

// *** MODIFIED: Now uses the 'focus' event for instant feedback ***
function setupDynamicResultHiding() {
    // List all the input fields that should trigger the result to hide
    const inputsToMonitor = [
        textInput,
        passwordInput,
        emojiInput,
        finalPasswordInput
    ];

    // Add an event listener to each one
    inputsToMonitor.forEach(input => {
        // Changed 'input' to 'focus'
        input.addEventListener('focus', () => {
            hideResult();
        });
    });
}


function setupCopyButton() {
    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(resultText.innerText).then(function() {
            copyBtn.textContent = 'Copied!';
            setTimeout(function() {
                copyBtn.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
            alert('Failed to copy text.');
        });
    });
}

function displayResult(message, color, showCopyButton) {
    resultDiv.style.display = "block";
    resultText.style.color = color;
    resultText.innerText = message;
    copyBtn.style.display = showCopyButton ? "block" : "none";
}

function hideResult() {
    resultDiv.style.display = "none";
    copyBtn.style.display = "none";
}

// --- Initialize the Application ---
setupTabSwitching();
handleEncryption();
handleDecryption();
setupCopyButton();
setupDynamicResultHiding();