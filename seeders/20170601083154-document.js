module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Documents', [
      {
        title: 'Blessed Assurance',
        content: `Blessed assurance, Jesus is mine!
          Oh! What a fortes, of glory divine.`,
        ownerId: 1,
        ownerRoleId: 1,
        access: 'private',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Wisdom Speaks',
        content: `The simple things are also the
          most extraordinary things, and only the wise can see them`,
        ownerId: 2,
        ownerRoleId: 2,
        access: 'role',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'What is folly?',
        content: `a costly ornamental building with no practical
          purpose, especially a tower or mock-Gothic ruin built
          in a large garden or park.`,
        ownerId: 2,
        ownerRoleId: 2,
        access: 'public',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'I have a dream!',
        content: `I have a dream, a song to sing
          To help me cope with anything
          If you see the wonder of a fairy tale
          You can take the future even if you fail`,
        ownerId: 2,
        ownerRoleId: 2,
        access: 'public',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Simon Game',
        content: `Simon is an electronic game of memory
        skill invented by Ralph H. Baer and Howard J. Morrison,
        with software programming by Lenny Cope, The device creates
        a series of tones and lights and requires a user to repeat the series`,
        ownerId: 1,
        ownerRoleId: 1,
        access: 'public',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {
      returning: true
    });
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Documents', null, {});
  }
};
