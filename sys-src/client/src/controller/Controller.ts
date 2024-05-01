export default class Controller {
    static isEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    static stringAvatar = (name: string) => {
        return {
            sx: {
                bgcolor: '#fff',
                color: '#000',
            },
            children: `${name[0]}${name[1]}`,
        };
    };
}
