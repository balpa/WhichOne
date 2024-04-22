/* eslint-disable no-console */
export const isEmailValid = (mail) => {
    const regex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;

    if (regex.test(mail)) {
        return (true);
    }

    return false;
};

export const log = (text) => {
    console.log(text);
};

export const alert = (text) => {
    alert(text);
};