import React, {Component} from "react";

class DisplayInformation extends Component {
  render() {
    return (
      <div style={{padding: "10px"}}>
        <h1>Information about the League</h1>
        <ul>
          <li>
            League is hosted at{" "}
            <a href="https://www.lakeforestgc.com/leagues/">
              Lake Forest Golf Club
            </a>
          </li>
          <li>
            League price is $300 for 12 weeks of play. Cost includes $18 green
            fee and $7 cart fee.
          </li>
          <li>
            Payment must be recieved in advance to complete your registration.
            Easiest payment method is via <a href="https://venmo.com/">Venmo</a>{" "}
            to @johnpc
          </li>
          <li>
            12 weeks beginning week of June 7 concluding week of August 23
          </li>
          <li>Tee times starting at 5:30pm each Thursday</li>
          <li>9-hole rounds with cart</li>
          <li>Play rotates between the back and front 9</li>
          <li>Teams include two golfers</li>
          <li>
            Matches are 1 team vs 1 team, stroke play. Handicap adjusted low
            handicap player on each team is 1 point. High handicap vs high
            handicap player is another point. Total handicap-adjusted score for
            the entire team is the third possible point you can score each week.
          </li>
          <li>
            Handicaps will be calculated after the first two weeks of play
          </li>
          <li>
            After handicaps are calculated, scoring will begin. Handicaps will
            update each week after scores are submitted.
          </li>
          <li>
            You are responsible for submitting your own scores. If you do not
            report a score, you will lose your matchup.
          </li>
          <li>
            If an odd number of teams register, you and your partner may play
            alone. This round will not be counted toward your score.
          </li>
          <li>Gimmies for close putts can be offered by your opponent.</li>
          <li>
            The maximum score on any hole is double par. If you reach double
            par, just pick up your ball, shake it off, move on, and report your
            score as double par for the hole.
          </li>
          <li>
            This league is relying on the honor system - please do not cheat.
          </li>
          <li>
            There is no prize for winning the league except bragging rights, but
            we encourage side bets among your playing partners.
          </li>
          <li>
            Some of us will be enjoying snacks and drinks at Lake Forest's
            dining area after each match. We'd love to have you there!
          </li>
          <li>
            Contact me at john@johncorser.com or text me at 989-598-7705. Note:
            I have my phone set up to automatically silence unknown callers, so
            until I have you in my contacts calling is not an option.
          </li>
        </ul>
      </div>
    );
  }
}

export default DisplayInformation;
