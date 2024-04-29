import AdminSignaller from "./signalling/network/admin-socket-sgnaller.js";

const testButton = document.querySelector("#test-button");

export function adminSetup(wss) {
  const adminSignaller = new AdminSignaller(wss);

  adminSignaller.addEventListener("password", () => {
    console.log("Wow, got pw request!");
    adminSignaller.send({ type: "secret", payload: "123456" });
  });

  testButton.onclick = () => {
    console.log("Hej!");
    adminSignaller.send({ type: "authenticated" });
  };

  adminSignaller.addEventListener("authenticated", (x) => {
    console.log(x);
  });
}
