import crypto from "crypto";

function encryptPassword(password: string, salt: string): Promise<{hash: string, salt: string}>{
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 1000, 64, "sha512", (err, key) => {
      if (err) {
        reject(err);
      } else {
        resolve({ hash: key.toString("hex"), salt });
      }
    });
  });
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  
  return encryptPassword(password, salt)
}

export async function verifyPassword({
  candidatePassword,
  salt,
  hash,
}: {
  candidatePassword: string;
  salt: string;
  hash: string;
}) {

 const {hash: candidateHash} = await encryptPassword(candidatePassword, salt)

  return candidateHash === hash;
}
