const SERVER = process.env.REACT_APP_SERVER;
const set = (route: string) => `${SERVER}${route}`;

export default class ApiRouter {
    static createHeaders = () => {
        const token = localStorage.getItem('token');
        return { headers: { 'x-auth-token': token ? token : '' } };
    };

    static getImageLink(dbLink: string): string | undefined {
        return set(dbLink);
    }

    static Register = set('/user/register');
    static Login = set('/user/login');
    static AddReview = set('/film/addreview');
    static GetReview = set('/film/getreview');
    static GetUsername = set('/user/getusername');
    static AddMovie = set('/admin/add-movie');
    static FetchUserData = set('/user/fetch-data');
    static GetMovieData = set('/admin/get-movie');
    static Search = set('/search');
    static DeleteReview = set('/film/deleteReview');
    static SubmitVote = set('/votes/submitVote');
    static GetVotes = set('/votes');
    static GetExistingUserVote = set('/votes/existingVote');
    static GetAllMovies = set('/admin/get-all-movies');
    static UpdateProfile = set('/user/usersettings');
}
