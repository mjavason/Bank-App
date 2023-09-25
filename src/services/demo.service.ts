import IDemo from '../interfaces/demo.interface'; // Make sure to import the appropriate model

class DemoService {

    /**
 * Confirm user referral
 * @description find user by referral code
 * @param code string
 * @returns
 */
    showDemo = async (body: IDemo) => {
        return body;
    };

}

export const demoService = new DemoService();
