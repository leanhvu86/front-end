export class Passenger {
    passengerId: string;
    name: string;
    email: string;
    address: string;
    birthday: string;
    idNo: string;
    education: {

        educationId: string;
        educationName: string,
        status: 1,
        address: string

    };
    mediaItem: {

        mediaItemId: string,
        path: string,
        mediaType: 1

    };
    province:
        {
            provinceId: string,
            provinceName: string
        }
}
