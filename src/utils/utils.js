import faker from "faker";

const Utils = {
  fakePerson() {
    const first = faker.name.firstName();
    const last = faker.name.lastName();
    const name = `${first} ${last}`;
    const email = faker.internet.email();
    return { name, first, last, email };
  },

  uniqueID() {
    return (
      Date.now().toString(36) +
      Math.random()
        .toString(36)
        .substr(2, 5)
    );
  }
};

export default Utils;
