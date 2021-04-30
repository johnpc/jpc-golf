/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPlayer = /* GraphQL */ `
  mutation CreatePlayer(
    $input: CreatePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    createPlayer(input: $input, condition: $condition) {
      id
      userId
      name
      email
      phone
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
      createdAt
      updatedAt
    }
  }
`;
export const updatePlayer = /* GraphQL */ `
  mutation UpdatePlayer(
    $input: UpdatePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    updatePlayer(input: $input, condition: $condition) {
      id
      userId
      name
      email
      phone
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
      createdAt
      updatedAt
    }
  }
`;
export const deletePlayer = /* GraphQL */ `
  mutation DeletePlayer(
    $input: DeletePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    deletePlayer(input: $input, condition: $condition) {
      id
      userId
      name
      email
      phone
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
      createdAt
      updatedAt
    }
  }
`;
export const createTeam = /* GraphQL */ `
  mutation CreateTeam(
    $input: CreateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    createTeam(input: $input, condition: $condition) {
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
          email
          phone
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
export const updateTeam = /* GraphQL */ `
  mutation UpdateTeam(
    $input: UpdateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    updateTeam(input: $input, condition: $condition) {
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
          email
          phone
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
export const deleteTeam = /* GraphQL */ `
  mutation DeleteTeam(
    $input: DeleteTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    deleteTeam(input: $input, condition: $condition) {
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
          email
          phone
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
export const createScore = /* GraphQL */ `
  mutation CreateScore(
    $input: CreateScoreInput!
    $condition: ModelScoreConditionInput
  ) {
    createScore(input: $input, condition: $condition) {
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
        name
        email
        phone
        team {
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
      score
      createdAt
      updatedAt
    }
  }
`;
export const updateScore = /* GraphQL */ `
  mutation UpdateScore(
    $input: UpdateScoreInput!
    $condition: ModelScoreConditionInput
  ) {
    updateScore(input: $input, condition: $condition) {
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
        name
        email
        phone
        team {
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
      score
      createdAt
      updatedAt
    }
  }
`;
export const deleteScore = /* GraphQL */ `
  mutation DeleteScore(
    $input: DeleteScoreInput!
    $condition: ModelScoreConditionInput
  ) {
    deleteScore(input: $input, condition: $condition) {
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
        name
        email
        phone
        team {
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
      score
      createdAt
      updatedAt
    }
  }
`;
export const createMatch = /* GraphQL */ `
  mutation CreateMatch(
    $input: CreateMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    createMatch(input: $input, condition: $condition) {
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
export const updateMatch = /* GraphQL */ `
  mutation UpdateMatch(
    $input: UpdateMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    updateMatch(input: $input, condition: $condition) {
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
export const deleteMatch = /* GraphQL */ `
  mutation DeleteMatch(
    $input: DeleteMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    deleteMatch(input: $input, condition: $condition) {
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
