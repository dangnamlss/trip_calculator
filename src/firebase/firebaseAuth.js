import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signOut
} from "firebase/auth";
import app from "./config";


export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

/**
 * Đăng nhập bằng email + password
 * @param {string} email
 * @param {string} password
 * @param {boolean} remember - true = lưu phiên đăng nhập
 */
export async function loginWithEmail(email, password, remember = false) {
  const persistence = remember ? browserLocalPersistence : browserSessionPersistence;
  await setPersistence(auth, persistence);
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

/**
 * Đăng nhập bằng Google
 */
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * Đăng nhập bằng Facebook
 */
export async function loginWithFacebook() {
  const result = await signInWithPopup(auth, facebookProvider);
  return result.user;
}
const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("Login success:", userCredential.user);
  } catch (error) {
    console.error(error.message);
  }
};

const logout = async () => {
  await signOut(auth);
};
/**
 * Gửi email đặt lại mật khẩu
 * @param {string} email
 */
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Map Firebase error code → thông báo tiếng Việt
 * @param {string} code
 */
export function getFirebaseErrorMessage(code) {
  const map = {
    "auth/invalid-email": "Email không hợp lệ.",
    "auth/user-not-found": "Tài khoản không tồn tại.",
    "auth/wrong-password": "Mật khẩu không đúng.",
    "auth/too-many-requests": "Quá nhiều lần thử. Vui lòng thử lại sau.",
    "auth/user-disabled": "Tài khoản đã bị vô hiệu hóa.",
    "auth/popup-closed-by-user": "Đã hủy đăng nhập.",
    "auth/account-exists-with-different-credential":
      "Email đã được đăng ký bằng phương thức khác.",
    "auth/network-request-failed": "Lỗi kết nối. Kiểm tra lại mạng.",
    "auth/invalid-credential": "Thông tin đăng nhập không hợp lệ.",
  };
  return map[code] || "Đã xảy ra lỗi. Vui lòng thử lại.";
}