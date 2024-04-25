
const crypto = require("crypto");
const util = require("util");

// this converts the callback function pbkdf2 into a promise using the util
// utility's promisify method
const hashPassword = util.promisify(crypto.pbkdf2);


export function isInteger(input:string) {

    // only digits, returns true
    return input?.match(/^\d+$/) ?? false;

}

export async function calculatePasswordHash(
    plainTextPassword:string, passwordSalt:string
) {
    const passwordHash = await hashPassword(
        plainTextPassword,
        passwordSalt,
        1000,
        64,
        "sha512"
    )

    return passwordHash.toString("hex");
}

// test is the password, o6... is the salt, we want to hash it 1000 times to make it harder to guess, 
// define the length of a password hash to 64 bytes, using the
// irreversible sha512 hashing algorithm, and () => is the callback function that takes as parameter error and
// the output... we then convert the output to string of type hexadecimal.
// crypto.pbkdf2("test", "o61TA7yaJIsa", 1000, 64, "sha512", (err, hash) => console.log(hash.toString('hex')))

