import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000" });

export async function castVote(address, option, unix, salt) {
  await api
    .post("/api/v1/voting", {
      address: address,
      option: option,
      unix: unix,
      salt: salt,
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
}

/*

      { t: "address", v: accounts[0] },
      { t: "uint256", v: option },
      { t: "string", v: salt },
      { t: "uint256", v: unix }

*/
