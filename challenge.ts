const challenge1 =
	"How much do you know...? well, don`t just say it! prove it!\nTake a 20 question quiz on any subject of your intrest and prove yourself...!";

const challenge2 =
	"Do you think you are smart...? well, let see what you`ve got,\nTake a 20 question quiz on any subject of your choice, we shall see how much you really know...!";

const challenge3 =
	"You think you are smart...? maybe or maybe not, there is only one way to find out,\nTake a 20 question quiz on any subject of your intrest, and we shall see...!";

const challenge4 =
	'Are you smart...? hmmm... there is a saying that "action speaks louder than words..." prove yourself by taking a quiz on any subject of your choice...!';

// return a random challenge text
export function getChallengeText() {
	// get a random number from 0 to 3
	const randomNum = Math.floor(Math.random() * 4);

	switch (randomNum) {
		case 0:
			return challenge1.split("");
		case 1:
			return challenge2.split("");
		case 2:
			return challenge3.split("");
		default:
			return challenge4.split("");
	}
}
