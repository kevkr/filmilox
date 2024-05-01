class UserRouterTestData {
    static Register = [
        {
            test: 'test success user',
            data: {
                email: 'test@test.com',
                password: 'testtest',
                username: 'username',
            },
            statusCode: 200,
        },
        {
            test: 'register user without username',
            data: {
                email: 'test@test.com',
                password: 'testtest',
            },
            statusCode: 400,
        },
        {
            test: 'register user without password',
            data: {
                email: 'test@test.com',
                username: 'username',
            },
            statusCode: 400,
        },
        {
            test: 'register user without email',
            data: {
                username: 'username',
                password: 'testtest',
            },
            statusCode: 400,
        },
        { test: 'fake register user', statusCode: 400 },
    ];

    static Login = [
        {
            test: 'login user success',
            data: { identifier: 'test@test.de', password: 'password' },
            statusCode: 200,
        },
        {
            test: 'login user failed',
            data: { identifier: 'test@test.de', password: 'passwort' },
            statusCode: 400,
        },
        {
            test: 'login user without password',
            data: { identifier: 'test@test.de' },
            statusCode: 400,
        },
        {
            test: 'login user without identifier',
            data: { password: 'password' },
            statusCode: 400,
        },
        {
            test: 'login user with no data',
            statusCode: 400,
        },
    ];

    static FetchData = [
        {
            test: 'fetch data from existing user',
            statusCode: 200,
        },
    ];
}

module.exports = UserRouterTestData;
