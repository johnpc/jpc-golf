/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePlayer = /* GraphQL */ `
  subscription OnCreatePlayer {
    onCreatePlayer {
      id
      userId
      team {
        id
        name
        homeMatches {
          nextToken
        }
        awayMatches {
          nextToken
        }
        players {
          nextToken
        }
        createdAt
        updatedAt
      }
      scores {
        items {
          id
          score
          createdAt
          updatedAt
        }
        nextToken
      }
      name
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePlayer = /* GraphQL */ `
  subscription OnUpdatePlayer {
    onUpdatePlayer {
      id
      userId
      team {
        id
        name
        homeMatches {
          nextToken
        }
        awayMatches {
          nextToken
        }
        players {
          nextToken
        }
        createdAt
        updatedAt
      }
      scores {
        items {
          id
          score
          createdAt
          updatedAt
        }
        nextToken
      }
      name
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePlayer = /* GraphQL */ `
  subscription OnDeletePlayer {
    onDeletePlayer {
      id
      userId
      team {
        id
        name
        homeMatches {
          nextToken
        }
        awayMatches {
          nextToken
        }
        players {
          nextToken
        }
        createdAt
        updatedAt
      }
      scores {
        items {
          id
          score
          createdAt
          updatedAt
        }
        nextToken
      }
      name
      createdAt
      updatedAt
    }
  }
`;
export const onCreateTeam = /* GraphQL */ `
  subscription OnCreateTeam {
    onCreateTeam {
      id
      name
      homeMatches {
        items {
          id
          date
          createdAt
          updatedAt
        }
        nextToken
      }
      awayMatches {
        items {
          id
          date
          createdAt
          updatedAt
        }
        nextToken
      }
      players {
        items {
          id
          userId
          name
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTeam = /* GraphQL */ `
  subscription OnUpdateTeam {
    onUpdateTeam {
      id
      name
      homeMatches {
        items {
          id
          date
          createdAt
          updatedAt
        }
        nextToken
      }
      awayMatches {
        items {
          id
          date
          createdAt
          updatedAt
        }
        nextToken
      }
      players {
        items {
          id
          userId
          name
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTeam = /* GraphQL */ `
  subscription OnDeleteTeam {
    onDeleteTeam {
      id
      name
      homeMatches {
        items {
          id
          date
          createdAt
          updatedAt
        }
        nextToken
      }
      awayMatches {
        items {
          id
          date
          createdAt
          updatedAt
        }
        nextToken
      }
      players {
        items {
          id
          userId
          name
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateScore = /* GraphQL */ `
  subscription OnCreateScore {
    onCreateScore {
      id
      match {
        id
        date
        homeTeam {
          id
          name
          createdAt
          updatedAt
        }
        awayTeam {
          id
          name
          createdAt
          updatedAt
        }
        scores {
          nextToken
        }
        createdAt
        updatedAt
      }
      player {
        id
        userId
        team {
          id
          name
          createdAt
          updatedAt
        }
        scores {
          nextToken
        }
        name
        createdAt
        updatedAt
      }
      score
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateScore = /* GraphQL */ `
  subscription OnUpdateScore {
    onUpdateScore {
      id
      match {
        id
        date
        homeTeam {
          id
          name
          createdAt
          updatedAt
        }
        awayTeam {
          id
          name
          createdAt
          updatedAt
        }
        scores {
          nextToken
        }
        createdAt
        updatedAt
      }
      player {
        id
        userId
        team {
          id
          name
          createdAt
          updatedAt
        }
        scores {
          nextToken
        }
        name
        createdAt
        updatedAt
      }
      score
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteScore = /* GraphQL */ `
  subscription OnDeleteScore {
    onDeleteScore {
      id
      match {
        id
        date
        homeTeam {
          id
          name
          createdAt
          updatedAt
        }
        awayTeam {
          id
          name
          createdAt
          updatedAt
        }
        scores {
          nextToken
        }
        createdAt
        updatedAt
      }
      player {
        id
        userId
        team {
          id
          name
          createdAt
          updatedAt
        }
        scores {
          nextToken
        }
        name
        createdAt
        updatedAt
      }
      score
      createdAt
      updatedAt
    }
  }
`;
export const onCreateMatch = /* GraphQL */ `
  subscription OnCreateMatch {
    onCreateMatch {
      id
      date
      homeTeam {
        id
        name
        homeMatches {
          nextToken
        }
        awayMatches {
          nextToken
        }
        players {
          nextToken
        }
        createdAt
        updatedAt
      }
      awayTeam {
        id
        name
        homeMatches {
          nextToken
        }
        awayMatches {
          nextToken
        }
        players {
          nextToken
        }
        createdAt
        updatedAt
      }
      scores {
        items {
          id
          score
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateMatch = /* GraphQL */ `
  subscription OnUpdateMatch {
    onUpdateMatch {
      id
      date
      homeTeam {
        id
        name
        homeMatches {
          nextToken
        }
        awayMatches {
          nextToken
        }
        players {
          nextToken
        }
        createdAt
        updatedAt
      }
      awayTeam {
        id
        name
        homeMatches {
          nextToken
        }
        awayMatches {
          nextToken
        }
        players {
          nextToken
        }
        createdAt
        updatedAt
      }
      scores {
        items {
          id
          score
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteMatch = /* GraphQL */ `
  subscription OnDeleteMatch {
    onDeleteMatch {
      id
      date
      homeTeam {
        id
        name
        homeMatches {
          nextToken
        }
        awayMatches {
          nextToken
        }
        players {
          nextToken
        }
        createdAt
        updatedAt
      }
      awayTeam {
        id
        name
        homeMatches {
          nextToken
        }
        awayMatches {
          nextToken
        }
        players {
          nextToken
        }
        createdAt
        updatedAt
      }
      scores {
        items {
          id
          score
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
