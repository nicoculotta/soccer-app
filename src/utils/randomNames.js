const generateRandomName = () => {
  const names = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Emma",
    "Frank",
    "Grace",
    "Henry",
    "Ivy",
    "Jack",
  ];
  const surnames = [
    "Smith",
    "Johnson",
    "Williams",
    "Jones",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
  ];

  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];

  return `${randomName} ${randomSurname}`;
};

const generateRandomEmail = (name) => {
  const sanitized = name.toLowerCase().replace(/\s/g, "");
  const providers = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
  const randomProvider =
    providers[Math.floor(Math.random() * providers.length)];

  return `${sanitized}@${randomProvider}`;
};

export function generateFakeUsers() {
  const usersArray = Array.from({ length: 30 }, (_, index) => ({
    avatar: `https://randomuser.me/api/portraits/thumb/${index}.jpg`,
    email: generateRandomEmail(generateRandomName()),
    name: generateRandomName(),
    provider: "randomprovider.com",
    role: "user",
    uid: `UID-${index}`,
  }));

  return usersArray;
}
