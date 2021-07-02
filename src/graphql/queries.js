/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPlayer = /* GraphQL */ `
  query GetPlayer($id: ID!) {
    getPlayer(id: $id) {
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
          items {
            id
            name
          }
        }
        createdAt
        updatedAt
      }
      scores {
        items {
          id
          score
          match {
            id
            date
            homeTeam {
              id
              name
            }
            awayTeam {
              id
              name
            }
          }
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
export const listPlayers = /* GraphQL */ `
  query ListPlayers(
    $filter: ModelPlayerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          items {
            id
            score
            match {
              id
              date
              homeTeam {
                id
                name
              }
              awayTeam {
                id
                name
              }
            }
            createdAt
            updatedAt
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTeam = /* GraphQL */ `
  query GetTeam($id: ID!) {
    getTeam(id: $id) {
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
          scores {
            items {
              id
              score
              match {
                id
                date
                homeTeam {
                  id
                  name
                }
                awayTeam {
                  id
                  name
                }
              }
              createdAt
              updatedAt
            }
            nextToken
          }
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
export const listTeams = /* GraphQL */ `
  query ListTeams(
    $filter: ModelTeamFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTeams(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        homeMatches {
          items {
            id
            date
            scores {
              items {
                score
                player {
                  id
                  name
                }
              }
            }
            homeTeam {
              id
              name
              players {
                items {
                  id
                  name
                  scores {
                    items {
                      id
                      score
                      match {
                        id
                        date
                        homeTeam {
                          id
                          name
                        }
                        awayTeam {
                          id
                          name
                        }
                      }
                      createdAt
                      updatedAt
                    }
                    nextToken
                  }
                }
              }
            }
            awayTeam {
              id
              name
              players {
                items {
                  id
                  name
                  scores {
                    items {
                      id
                      score
                      match {
                        id
                        date
                        homeTeam {
                          id
                          name
                        }
                        awayTeam {
                          id
                          name
                        }
                      }
                      createdAt
                      updatedAt
                    }
                    nextToken
                  }
                }
              }
            }
          }
        }
        awayMatches {
          items {
            id
            date
            scores {
              items {
                score
                player {
                  id
                  name
                }
              }
            }
            homeTeam {
              id
              name
              players {
                items {
                  id
                  name
                  scores {
                    items {
                      id
                      score
                      match {
                        id
                        date
                        homeTeam {
                          id
                          name
                        }
                        awayTeam {
                          id
                          name
                        }
                      }
                      createdAt
                      updatedAt
                    }
                    nextToken
                  }
                }
              }
            }
            awayTeam {
              id
              name
              players {
                items {
                  id
                  name
                  scores {
                    items {
                      id
                      score
                      match {
                        id
                        date
                        homeTeam {
                          id
                          name
                        }
                        awayTeam {
                          id
                          name
                        }
                      }
                      createdAt
                      updatedAt
                    }
                    nextToken
                  }
                }
              }
            }
          }
        }
        players {
          items {
            id
            name
            scores {
              items {
                id
                score
                match {
                  id
                  date
                  homeTeam {
                    id
                    name
                  }
                  awayTeam {
                    id
                    name
                  }
                }
                createdAt
                updatedAt
              }
              nextToken
            }
          }
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getScore = /* GraphQL */ `
  query GetScore($id: ID!) {
    getScore(id: $id) {
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
export const listScores = /* GraphQL */ `
  query ListScores(
    $filter: ModelScoreFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listScores(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        match {
          id
          date
          createdAt
          updatedAt
        }
        player {
          id
          userId
          name
          email
          phone
          createdAt
          updatedAt
        }
        score
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMatch = /* GraphQL */ `
  query GetMatch($id: ID!) {
    getMatch(id: $id) {
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
          items {
            name
            id
            scores {
              items {
                id
                score
                match {
                  date
                  id
                }
              }
            }
          }
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
          items {
            name
            id
          }
        }
        createdAt
        updatedAt
      }
      scores {
        items {
          id
          score
          player {
            id
            name
            scores {
              items {
                id
                score
                match {
                  date
                  id
                }
              }
            }
          }
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
// Typo generated by Amplify CLI
// See https://github.com/aws-amplify/amplify-cli/pull/7258
export const listMatchs = /* GraphQL */ `
  query ListMatchs(
    $filter: ModelMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMatchs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        date
        homeTeam {
          id
          name
          players {
            items {
              id
              name
              scores {
                items {
                  id
                  score
                  match {
                    id
                    date
                    homeTeam {
                      id
                      name
                    }
                    awayTeam {
                      id
                      name
                    }
                  }
                  createdAt
                  updatedAt
                }
                nextToken
              }
            }
          }
          createdAt
          updatedAt
        }
        awayTeam {
          id
          name
          players {
            items {
              id
              name
              scores {
                items {
                  id
                  score
                  match {
                    id
                    date
                    homeTeam {
                      id
                      name
                    }
                    awayTeam {
                      id
                      name
                    }
                  }
                  createdAt
                  updatedAt
                }
                nextToken
              }
            }
          }
          createdAt
          updatedAt
        }
        scores {
          items {
            score
            player {
              id
              name
            }
          }
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
