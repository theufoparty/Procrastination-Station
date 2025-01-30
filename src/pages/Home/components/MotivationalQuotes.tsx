import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const pratchettStyleQuotes = [
  'When the realm of undone chores grows monstrous, brandish your to-do list like a mighty sword.',
  'Time’s a slippery beast, best snagged with a net of deadlines and strong tea.',
  'A man can outrun a troll if he starts early enough, but a missed task will chase him forever.',
  'Procrastination is a cunning wizard—vanquish it by setting a timer and brewing a fresh cup of courage.',
  'No day is truly wasted if you’ve at least tamed one unruly task before supper.',
  'Beware the siren call of ‘later’—she’ll lure you to a rocky shore of half-done projects.',
  'Between dawn and dusk lie many hours ripe for heroism—your tasks await their champion.',
  'A wise schedule is like a well-trained dragon: fierce, but loyal, keeping chaos at bay.',
  'Your future self will curse or bless you depending on whether you finish that report now or not.',
  'Magic might be elusive, but finishing that spreadsheet on time? That’s a sorcery all its own.',
  'In the kingdom of half-finished jobs, the one who actually completes something is king.',
  'The easiest way to beat a deadline is to show up before it knows you’re there.',
  'Let not the clock mock you; it’s only a device. You, on the other hand, are unstoppable (when caffeinated).',
  'A hero is merely someone who meets his tasks head-on and emerges with a tidy desk.',
  'Better a short to-do list fulfilled than a grand one consigned to dusty legend.',
  'Procrastination is an impish bard whispering sweet nothings—silence it with swift action.',
  'Take a leaf from the witches: they do the job before the goat starts chewing the laundry.',
  'Dawdling is a dragon of your own making. Slay it early, or it shall grow fangs.',
  'There are potions to banish migraines and spells to dispel gloom, but none so potent as finishing that last task.',
  'Glory doesn’t always come from slaying monsters; sometimes it comes from sending that email on time.',
  'If you can’t catch time by the tail, at least steer it with a to-do list.',
  'No wizard was ever late to his greatest spell—treat your tasks with equal reverence.',
  'A little planning is like a small enchantment that wards away the chaos of undone chores.',
  'Ever notice how tasks breed in the dark, like mushrooms? Shine some organization on them.',
  'Scheduling: the fine art of telling your dragons which day to show up.',
  'The difference between a chore and an adventure is all in the spirit you bring to it.',
  'When in doubt, conjure a Post-it note. It won’t solve the problem, but it’ll keep you from forgetting it.',
  'Today’s undone tasks are tomorrow’s regrets—unless you prefer regrets for breakfast.',
  'For a fleeting moment each morning, time stands still. Use it to plan, then sprint onward!',
  'Legend says the greatest heroes are those who vanquish their entire backlog before tea.',
  'If time were a person, it’d be that friend who leaves without saying goodbye—so keep an eye on it.',
  'A neglected task is like an unswept stable; it just gets messier if you wait.',
  'To do or not to do? Wrong question. The right question is: when?',
  'He who conquers his schedule in the morning shall spend the afternoon in well-deserved peace.',
  'A good day is one where the tasks tremble in your presence, not the other way around.',
  'Small tasks are like gremlins—harmless alone, but if you ignore them, they multiply.',
  'Time is neither friend nor foe; it’s merely the stage. You decide whether the play is a tragedy or triumph.',
  'Never trust a missed deadline; it whispers to the others, and soon they rise in rebellion.',
  'Look not for dragons to slay; look for the bullet points that need finishing, for they breathe real fire.',
  'All the wonders of the universe won’t help if you can’t remember to send that invoice.',
  'Some tasks require wizardry, others just require you to roll up your sleeves.',
  'When tasks pile up like the Tower of Art, you might need a bit of structural reinforcement—a plan.',
  'Tea first. Tasks second. Triumph third. It’s the universal order, you see.',
  'Beware the illusion of infinite time: it’s a trick even the gods have fallen for.',
  'Fate is fickle, but a to-do list is steadfast—provided you look at it once in a while.',
  'In the battle between you and the undone tasks, your greatest weapon is a pen that crosses them off.',
  'No one writes songs about ‘I almost finished my chores.’ Go forth and finish them!',
  'Punctuality is a polite wizard’s trick; arriving on time is half the spell.',
  'The busiest bees produce the sweetest honey—and have the most satisfying checklists.',
  'Procrastination shares a stable with regret, and they’re both hungry mares.',
  'A missed task is a door left ajar for chaos to stroll in and raid the biscuit tin.',
  'Mornings are magical because they come with fresh possibilities and only slightly stale coffee.',
  'One does not simply vanish a messy desk. One sorts, stacks, and triumphs.',
  'Deadline dragons cower in the face of thorough planning. Or perhaps they’re just allergic to sticky notes.',
  'When in trouble, when in doubt, cross one item off your list, and the rest might just follow suit.',
  'The quill is mightier than the sword—especially when the sword is pointed at a neglected spreadsheet.',
  'It’s not about having time; it’s about making time squeal in surrender.',
  'The morning breeze carries the whisper: ‘Today is a good day to do something important.’',
  'Beware of short tasks unhatched; they can grow wings and become monstrous chores overnight.',
  'Between a rock and a hard place, slip in a reminder on your phone, just to keep order.',
  'Routine is like a faithful donkey: it’ll carry you far, but only if you feed it consistency.',
  'The bravest souls are not those who slay giants, but those who submit timesheets on schedule.',
  'Chaos seldom needs an invitation; it arrives when your to-do list is left unattended.',
  'Take heart! Even the longest list eventually runs out of bullet points.',
  'Every tick of the clock is a tiny footstep of inevitability—best to guide it where you want to go.',
  'A well-placed checkmark can eclipse the mightiest of swords.',
  'Time is life’s currency; spend it well, or find your tasks bankrupt at the day’s end.',
  'Why dread the undone? Tackle it, trounce it, and toast your success afterwards.',
  'Like a wizard’s library, your schedule can be an endless labyrinth—keep a map or risk being lost.',
  'Scribbled plans are no less powerful than printed scrolls; only the finishing blow matters.',
  'Task management is basically housekeeping for the mind—less clutter, more clarity.',
  'Slay your daily dragons before they grow too large for the stable.',
  'A dream remains a dream until you schedule it into existence.',
  'Brewing an idea is as fine as brewing tea—just don’t forget to pour it out and actually serve it.',
  'A tidy schedule leads to a tidy mind, and that’s a fortress against any chaos.',
  'When you finish something ahead of time, you’re basically bending reality. Well done.',
  'If you can’t outsmart time, at least outrun your excuses.',
  'Procrastination tries to lock the door, but your determination has the key.',
  'The hallmark of a wise wizard: a plan for the day, a quill at the ready, and a strong sense of humor.',
  'Don’t wait for the perfect moment—time is an unreliable friend, always running off for a snack.',
  'A minute wasted is a tiny tragedy; multiply that by an hour, and you’ve got a big, grumpy troll.',
  'Fortune favors those who write things down and then actually do them.',
  'Left unchecked, ‘tomorrow’ becomes an entire kingdom of yesterdays.',
  'Tasks are like rows of dominoes. Tip one over and watch the rest take care of themselves.',
  'In the company of good planning, even the surliest deadline can be charmed.',
  'Ambitions may be grand, but they still require the practical magic of turning up on time.',
  'Haste is not always waste if you’re sprinting toward the finish line with purpose.',
  'If you wouldn’t entrust your lunch to a wandering imp, don’t entrust your time to chance.',
  'A single completed task is better than a stack of perfectly planned ones left untouched.',
  'One must never underestimate the power of crossing out a line on a checklist.',
  'If you must daydream, daydream of yourself completing tasks with flair and applause.',
  'A delayed start is the mother of a long night. Begin promptly and sleep soundly.',
  'A tidy desk is not required, but a tidy plan is indispensable.',
  'An idle hour is a goblin in disguise—spot it, tame it, and use it well.',
  'When you befriend your deadlines, they no longer come armed with pitchforks.',
  'Nudge the day in the right direction by toppling at least one big boulder of a task.',
  'Even the grandest tower is laid brick by brick. Tasks are no different, but mind the mortar.',
  'Elbow grease may not be a spell component, but it certainly works wonders on a to-do list.',
  'The greatest illusions are the ones we cast on ourselves: ‘I have plenty of time.’',
  'Ticking off a final task is the sweetest sound in the symphony of productivity.',
];

const QuoteBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const QuoteText = styled.p`
  font-style: italic;
  font-size: 0.9em;
  margin-top: 1em;
`;

// const QuoteButton = styled.button`
//   border: none;
//   font-size: 0.5em;
//   font-family: 'Montserrat', serif;
//   font-weight: 300;
//   width: fit-content;
//   padding: 10px;
//   background-color: #35328b;
//   color: white;
//   border-radius: 20px;
//   cursor: pointer;
// `;

const MotivationalQuotes: React.FC = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * pratchettStyleQuotes.length);
    setQuote(pratchettStyleQuotes[randomIndex]);
  }, []);

  //   const getNewQuote = () => {
  //     const randomIndex = Math.floor(Math.random() * pratchettStyleQuotes.length);
  //     setQuote(pratchettStyleQuotes[randomIndex]);
  //   };

  return (
    <QuoteBox>
      <QuoteText>{quote}</QuoteText>
      {/* <QuoteButton style={{ marginTop: '1em' }} onClick={getNewQuote}>
        Another!
      </QuoteButton> */}
    </QuoteBox>
  );
};

export default MotivationalQuotes;
