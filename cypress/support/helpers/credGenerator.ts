import { faker } from '@faker-js/faker';

export interface Creds {
    username: string;
    password: string;
}

export const credGenerator = {
    generateFakeCreds(): Creds {
        return {
            username: `${faker.internet.userName()}_${Date.now()}`,
            password: faker.internet.password({ length: 15 }),
        };
    },

    generateLongCreds(): Creds {
        return {
            username: (faker.internet.username() + '_').padEnd(105, 'x'),
            password: (faker.internet.password({ length: 10 }) + '_').padEnd(244, 'x'),
        };
    },

    generateSpecialCharCreds(): Creds {
        const specialChar = "!@#$%^&*()_+-=[]{}|;':,.<>/?";
        return {
            username: `${faker.internet.userName()}_${specialChar}`,
            password: faker.internet.password({ length: 15 }),
        };
    },

    generateRandomSpaceCreds(): Creds {
        return {
            username: ' '.repeat(70 + Math.floor(Math.random() * 20)),
            password: faker.internet.password({ length: 8, memorable: true }),
        };
    },

    generateXssCreds(): Creds {
        const payload = `<script>alert('XSS_${Date.now()}')</script>`;
        return {
            username: payload,
            password: faker.internet.password({ length: 12 }),
        };
    }
};