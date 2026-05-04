import http from 'k6/http';
import { sleep } from 'k6';

const TOKEN ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsImlhdCI6MTc3NzM2MzY0MywiZXhwIjoxNzc3OTY4NDQzfQ.yIjTKoU6-2w6BG2cRYuLeyBAV9jM8kR__qLwy8yj_mM";
export const options = {
  vus: 50,
  duration: '30s',
};

// LOGIN 1 LẦN
export function setup() {
  const payload = JSON.stringify({
    email: 'john@example.com',
    password: 'password123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(
    'http://localhost:5000/api/auth/login',
    payload,
    params
  );

  const body = JSON.parse(res.body);

  console.log('LOGIN STATUS:', res.status);

  return {
    token: body.token, // ✅ lấy token
  };
}

// FLOW USER
export default function (data) {
  const params = {
    headers: {
      Authorization: `Bearer ${TOKEN}`, // ✅ dùng Bearer
    },
  };

  const res = http.get('http://localhost:5000/api/projects', params);
 console.log(res.status);

  sleep(1);
}