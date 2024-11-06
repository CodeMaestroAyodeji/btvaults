// import React from 'react';
// import { ReCaptcha } from 'react-recaptcha-google';

// function GoogleCaptcha({ onVerify }) {
//     const recaptchaLoaded = () => {
//         console.log("Captcha loaded successfully");
//     };

//     return (
//         <ReCaptcha
//             sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
//             render="explicit"
//             onloadCallback={recaptchaLoaded}
//             verifyCallback={onVerify}
//         />
//     );
// }

// export default GoogleCaptcha;

import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

function GoogleCaptcha({ onVerify }) {
    const handleCaptchaChange = (token) => {
        if (token) {
            console.log("Captcha token received:", token); // Debugging line
            onVerify(token);
        } else {
            onVerify(''); // Clear the token if verification fails
        }
    };

    return (
        <div className="captcha-container">
            <ReCAPTCHA
                sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                onChange={handleCaptchaChange}
            />
        </div>
    );
}

export default GoogleCaptcha;
