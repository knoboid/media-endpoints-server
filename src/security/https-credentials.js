import fs from "fs";
import { getEnv } from "./util.js";

/**
 * Provides a server options object from a .env file.
 * The .env file must be in the project root.
 * It's contents should be similar to this:
 *
 * SERVER_KEY = "/path/to/server.key"
 * SERVER_CERT = "/path/to/server.crt"
 * PASSPHRASE = "passphrase_if_used"
 *
 * In order to generate a private key and certificate for
 * a webserver read an online guide: search for
 * 'generate self signed certificate for https'.
 *
 * @returns serverOptions object with the following structure:
 * {key, cert, passphrase}
 *
 */
export function provideDotEnvServerOptions() {
  const key = fs.readFileSync(getEnv("SERVER_KEY"), "utf8");
  const cert = fs.readFileSync(getEnv("SERVER_CERT"), "utf8");
  const passphrase = getEnv("PASSPHRASE");

  return {
    key,
    cert,
    passphrase,
  };
}

function provideInsecureServerOptions() {
  const key = `-----BEGIN ENCRYPTED PRIVATE KEY-----
MIIC1DBOBgkqhkiG9w0BBQ0wQTApBgkqhkiG9w0BBQwwHAQIwO7yzI7+y1kCAggA
MAwGCCqGSIb3DQIJBQAwFAYIKoZIhvcNAwcECDZMd1XmODToBIICgKFKrKx66pnf
7rT9Q8JiX31TS0D7ht9UGGU5/SSI/4Hr46IBTvaQtpevSuyqKm5k61I+wnpyXDmv
86ddPt4Fh9niaICu1ZTRfONFNGMWn2SR3zn20P8fD3W58gpYf269+Lz2bI2cRtht
dn5uicPRvyknwHTxTVjpcz0i3lj6G056z/FUzH1qUwwmepmvntj2Bqmu4+PHS/Bt
C9K21p1DbQ3+zxNgPNXnEX1Mgs9NK7s1LYjh+uzg8yizEZtJNFbdZq/uyJFmlCNX
UwIz8IjrVTApw6S1NhDv08qKaeJAwmH++x17+opvpzF1wURuSC68dv40YIVH3VNC
2D6q9yfm/A5DPqZGnsPqDKP5nZPULZLkyQ9/J675vR/Ck960O1ex1WpKeiedpJ66
K8B3tky72LerXMY4c/17XqG6idwHELuWu+raz91k6Ke34rM864A9xJfEQXV2sPW1
tFYoeJpjkzGF7YezdQFPi0a/lo5WvsBfXu9+lhM+qJ54qh04Vb51MpIopFRjc03s
gMOc5sEplQ5pPKmPmEtkljhcRqh1PMtl6P+quGYapqiD3IZhy0Bpq/yYu7Hm/eYK
YQ/uB7oEY3yhr1pMw1zpJxrYxZXQgIGQpSV5fDiE0WuQ6ciHCfXAH1lHq2p+1M6q
rWtQNBe8oqlKhrXMimqesLEYp7zULKQguE2C+lC2F5blA/PkGbN2He6OI07dBoZd
KhAoMUDlmE+ll3Zlu/wMOb6rFpRTnIxKt+S7rQYGHbAOs0BA52wlXM+OoadP9mos
WzRqcIt62z6XtqoOdJY81DdrLbtVjT+GhPOb5nhPIpXJdSSc375oTmNiBOh1ODXO
SIwP/JJgVfM=
-----END ENCRYPTED PRIVATE KEY-----`;
  const cert = `-----BEGIN CERTIFICATE-----
MIICDDCCAXUCFHodZWjofWHwUzn5yWNFW1FWVPwnMA0GCSqGSIb3DQEBCwUAMEUx
CzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRl
cm5ldCBXaWRnaXRzIFB0eSBMdGQwHhcNMjQwNDEyMTkwMjU3WhcNMjUwNDEyMTkw
MjU3WjBFMQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UE
CgwYSW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIGfMA0GCSqGSIb3DQEBAQUAA4GN
ADCBiQKBgQDOkY8MvDCWMbzTjv1Q0L5pkMP2/ZYzyyt6cfvkAr8UZTaFMf7cY1Yc
rejrrxHL5CEawzEloip/HKoWOroh0HGiCzDXq3i1HXvSNHbEPOFfbXPcjsZeVne3
4vy1Zhv3hdtNMJjD2AHXr+aphyh5/rk+6SyUdTDgQxCLvxPvN05nvwIDAQABMA0G
CSqGSIb3DQEBCwUAA4GBAJQGUkCepAh5kBbRfPeGFUhBN7NCFw/yqAA+wXtGlvUl
rShm983mjnuIm2T+1sjket4tUzf7ZzStm9FC4VWIUq0of721N9FnKyCSxtvDUjse
9EeoGskdnDpkI9LjQ2yrZgDBboIx9KvdABgGaokOFYfLFy0Fl5Xsk2DmnvUSrpc/
-----END CERTIFICATE-----`;
  const passphrase = "passphrase";

  return {
    key,
    cert,
    passphrase,
  };
}

export const devServerOptions = provideInsecureServerOptions();
