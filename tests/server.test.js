// Unit tests
const createServer = require("../server");
const supertest = require('supertest');

// longer timeout since webscraping takes time
jest.setTimeout(50000)

// define server and app
let server = null;
let app = null;

beforeAll(() => {
  // start server
  app = createServer();
  server = app.listen(8888);
});

afterAll(() => {
  // close server
  server.close();
});

describe("Generic Tests", () => {
  // test to ensure server connection
  test("Test Server", async () => {
    await supertest(app).get('/')
    .expect(200)
    .then((response) => {
      expect(response.text).toBe("Server Up");
    });
  });

  //
  test("Check supported sites", async () => {
    const sites = ['Reddit', 'Twitter'];
    await supertest(app).get('/sites')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(sites);
    });
  });

  // Completely unsuported site
  test("Extract Unsupported site", async () => {
    url = "https://www.google.com";
    await supertest(app).post("/extract").send({ url: url })
      .expect(500)
      .then((error) => {
        expect(error.body.error).toBe("Invalid link: We don't support this site yet");
    });
  });
});

describe("Twitter tests", () => {
  // Fully valid random twitter link, contains an image
  test("Extract Twitter Valid", async () => {
    const url = 'https://twitter.com/statmuse/status/1585456495541772288';
    const post = {
      site: 'Twitter',
      url: url,
      content: 'Site: Twitter\n' +
        'User: @statmuse\n' +
        'Time posted: 2022-10-27T02:20:59.000Z\n' +
        '\n' +
        'Giannis now leads the NBA in scoring with 36.0 PPG on 67.7% shooting.\n' +
        '\n' +
        'Good night.\n' +
        '\n' +
        'Link: https://pbs.twimg.com/media/FgCsR6yacAIW0CC?format=jpg&name=small\n'
    };
  
    await supertest(app).post("/extract").send({ url: url })
      .expect(200)
      .then((response) => {

        // Check data
        expect(response.body.site).toBe(post.site);
        expect(response.body.url).toBe(post.url);
        expect(response.body.content).toBe(post.content);
      });
  });
  
  // No body text, just a Gif (not much is gathered in this case)
  test("Extract Twitter no body text", async () => {
    const url = 'https://twitter.com/EmilyPa42700209/status/1623921342298083329';
    const post = {
      site: 'Twitter',
      url: url,
      content: 'Site: Twitter\n' +
        'User: @EmilyPa42700209\n' +
        'Time posted: 2023-02-10T05:46:33.000Z\n'
    };
  
    await supertest(app).post("/extract").send({ url: url })
      .expect(200)
      .then((response) => {

        // Check data
        expect(response.body.site).toBe(post.site);
        expect(response.body.url).toBe(post.url);
        expect(response.body.content).toBe(post.content);
      });
  });

  // Post with a link and image
  test("Extract Twitter with links", async () => {
    const url = 'https://twitter.com/boulderpolice/status/1623088935374299136';
    const post = {
      site: 'Twitter',
      url: url,
      content: 'Site: Twitter\n' +
        'User: @boulderpolice\n' +
        'Time posted: 2023-02-07T22:38:52.000Z\n' +
        '\n' +
        'Want to know more about what your Boulder Police Department does in our community? Here is some data from the past week. Read more detailed crime stats on our crime dashboard at https://bouldercolorado.gov/crime-dashboard #boulder #BoulderColorado\n' +
        '\n' +
        'Link: https://pbs.twimg.com/media/FoYIDeYaAAANkhs?format=jpg&name=small\n'
    };
  
    await supertest(app).post("/extract").send({ url: url })
      .expect(200)
      .then((response) => {

        // Check data
        expect(response.body.site).toBe(post.site);
        expect(response.body.url).toBe(post.url);
        expect(response.body.content).toBe(post.content);
      });
  });

  // post with 2 images
  test("Twitter post with multiple images", async () => {
    const url = 'https://twitter.com/ech0bug/status/1623911758623805440'
    const post = {
      site: 'Twitter',
      url: url,
      content: 'Site: Twitter\n' +
        'User: @ech0bug\n' +
        'Time posted: 2023-02-10T05:08:28.000Z\n' +
        '\n' +
        'thank you pierce the veil and paramore for starting off 2023 right\n' +
        '\n' +
        'Links:\n' +
        'https://pbs.twimg.com/media/FolLIsEaMAAYIBx?format=jpg&name=360x360\n' +
        'https://pbs.twimg.com/media/FolLIsFagAEVFyt?format=jpg&name=360x360\n'
    };
  
    await supertest(app).post("/extract").send({ url: url })
      .expect(200)
      .then((response) => {

        // Check data
        expect(response.body.site).toBe(post.site);
        expect(response.body.url).toBe(post.url);
        expect(response.body.content).toBe(post.content);
      });
  });

  describe("Error Checks", () => {
    // Link contains "twitter.com" but not "/status/"
    test("Invalid Twitter link", async () => {
      url = "https://twitter.com/";
      await supertest(app).post("/extract").send({ url: url })
        .expect(500)
        .then((error) => {
          expect(error.body.error).toBe("Twitter link is not a post");
      });
    });
  
    // Link contains "twitter.com" and "/status/" but leads to an invalid post (such as a deleted post)
    test("Invalid Twitter link past initial url check", async () => {
      url = "https://twitter.com/status/hebfklawebflaiwbefklawbefthisshouldntwork/";
      await supertest(app).post("/extract").send({ url: url })
        .expect(500)
        .then((error) => {
          expect(error.body.error).toBe("Twitter link invalid");
      });
    });
  })
})


describe("Reddit extraction tests", () => {
  // Fully valid random reddit post
  test("Extract Reddit Valid", async () => {
    const url = 'https://www.reddit.com/r/redditdev/comments/7u94lj/how_to_get_posts_using_api/';
    const post = {
      site: 'Reddit',
      url: url,
      content: 'Site: Reddit\n' +
        'User: u/alex-kozack\n' +
        'Subreddit: r/redditdev\n' +
        '\n' +
        'Title: How to get posts using api?\n' +
        '\n' +
        'I want to implement a node server, which on demand will receive and store the last posts from the subrredit. How to implement? How to get authorized? How to use api?\n'       
    };

    await supertest(app).post("/extract").send({ url: url })
      .expect(200)
      .then((response) => {

        // Check data
        expect(response.body.site).toBe(post.site);
        expect(response.body.url).toBe(post.url);
        expect(response.body.content).toBe(post.content);
      });
  });

  // Reddit post with no body, only title
  test("Extract Reddit, no body", async() => {
    const url = 'https://www.reddit.com/r/AnimalsBeingBros/comments/10yan5f/this_kitty_has_adopted_a_juvenile_possum_and_lets/';
    const post = {
      site: 'Reddit',
      url: url,
      content: 'Site: Reddit\n' +
        'User: u/purple-circle\n' +
        'Subreddit: r/AnimalsBeingBros\n' +
        '\n' +
        'Title: This kitty has adopted a juvenile possum and lets him ride around on her as its mother would\n'
    };

    await supertest(app).post("/extract").send({ url: url })
      .expect(200)
      .then((response) => {

        // Check data
        expect(response.body.site).toBe(post.site);
        expect(response.body.url).toBe(post.url);
        expect(response.body.content).toBe(post.content);
      });
  })

  // Reddit post with image
  test("Extract reddit with image", async () => {
    const url = 'https://www.reddit.com/r/mildlyinfuriating/comments/10xznr6/my_so_throws_her_daily_contacts_behind_the/'
    const post = {
      site: 'Reddit',
      url: url,
      content: 'Site: Reddit\n' +
        'User: u/FireRotor\n' +
        'Subreddit: r/mildlyinfuriating\n' +
        '\n' +
        'Title: My SO throws her daily contacts behind the headboard of our bed.\n' +
        '\n' +
        'Link: https://i.redd.it/dd7x7o9li8ha1.jpg\n'
    };

    await supertest(app).post("/extract").send({ url: url })
      .expect(200)
      .then((response) => {

        // Check data
        expect(response.body.site).toBe(post.site);
        expect(response.body.url).toBe(post.url);
        expect(response.body.content).toBe(post.content);
      });
  });

  // Reddit post with an external link (these are not imbedded in the text)
  test("Reddit with external link", async () => {
    const url = 'https://www.reddit.com/r/worldnews/comments/10y8gm7/russia_illegally_occupying_islands_off_hokkaido/'
    const post = {
      site: 'Reddit',
      url: url,
      content: 'Site: Reddit\n' +
        'User: u/progress18\n' +
        'Subreddit: r/worldnews\n' +
        '\n' +
        'Title: Russia illegally occupying islands off Hokkaido: Japan\n' +
        '\n' +
        'Link: https://www.taiwannews.com.tw/en/news/4804940\n'
    };

    await supertest(app).post("/extract").send({ url: url })
      .expect(200)
      .then((response) => {

        // Check data
        expect(response.body.site).toBe(post.site);
        expect(response.body.url).toBe(post.url);
        expect(response.body.content).toBe(post.content);
      });
  });

  // A very very long posts with multiple lines and links
  test("Long Multiline post", async () => {
    const url = "https://www.reddit.com/r/BestofRedditorUpdates/comments/10y4jmj/confused_dad_al_parents_please_respond/";
    const post =   {
      site: 'Reddit',
      url: url,
      content: 'Site: Reddit\n' +
        'User: u/Iamnotgoodwithnames6\n' +
        'Subreddit: r/BestofRedditorUpdates\n' +
        '\n' +
        'Title: Confused Dad. AL parents please respond!\n' +
        '\n' +
        'I am not the OP! The original post was made by u/throwawayjoesixpack in r/actuallesbians\n' +
        'mood spoiler: supportive parents but questionable parenting decisions.\n' +
        '\n' +
        '\n' +
        'Confused Dad. AL parents please respond! - 27 May 2015\n' +
        '(Please be kind, my head is still reeling a bit). I love my daughter and am proud of her, but to be succinct in the post, I have omitted large parts of the story about her awesomeness and how much I have told her I love her.\n' +
        "My 13 yo daughter told us last night that for the last few months she has been 'dating' another girl at school (7th grade). She had been evading the subject with my wife and me for several months, but it came to a head because her girlfriend's mother overheard something and asked my daughter over to talk to her. From my daughter's description, her GF's parents are religious, and, can be harsh (physically) in discipline. My daughter did not know what to do.\n" +
        `I would like to say that both my wife and I were wonderfully supportive, etc, but like most people, I think we did somethings right and somethings wrong. My first reaction was to say the same thing we had said to our step-daughter (now 24): "No dating as couples until you are 16. You can be friends, you can have feelings, you can have crushes, but no one-on-one activities until you are 16. Therefore, no GF's." We have encouraged our older kids to not exclusively date until after college. This has worked well on the older ones.\n` +      
        'Last night, for the daughter in question, we banned all same-sex sleepovers after we had found out that it is at sleepovers where they first kissed, etc. I reacted to this revelation like this was a heterosexual experience. These sleepovers have all been group events, birthday parties, etc.\n' +
        "I have since come to realize that my attempts to limit the intensity of relationships for the kids was more about heterosexual relations. It has more to do with being safe (physically), pregnancy (big one) and STD's and waiting until such an age as the person can make more responsible decisions. This is less of a concern for this situation.\n" +
        "I do trust my daughter. I am thinking of restricting overnights only for situations where her 'crushes' are guests. (No limit on parties or group events, just overnights).\n" +
        "As for her friend's mother, I told my daughter she is not allowed to talk to the girl's parents. If they want to talk to us, they can, but our daughter is not prepared to deal with another set of confused adults about this.\n" +
        'Are there things I am not thinking about? As a lesbian, if your 13 year old daughter started experimenting, where would you draw the line with sleepovers? I do know that kids will be kids, at the same time I do not feel it is right to encourage intense relationships at too young an age.\n' +
        'Just writing this has cleared up a lot for me. Again, I have omitted quite a bit from the story just to make this particular posting more focused.\n' +
        'Thanks for reading.\n' +
        'More information provide:\n' +
        'I think from the other posts, I may be misunderstood. We treat all 4 kids the same. My confusion is making an exception so she can have overnights with non-romantic friends. She will be as honest with us as she can, she is a good person, young and trying to figure this stuff out too. If she were to lie, it would not be the end of the world--just another LONG lecture from Dad. But it would be really out of character for her to lie.\n' +
        "She is on college track now, she is in the gifted and talented program at school, and brings home A's and B's (except for a little issue earlier this year).\n" +
        `I have given the same speech to each one of my step-daughter's BFs. "If you hurt her, and I don't mean break a date with her or get into a disagreement with her, if you really hurt her, I will hurt you." (I am kind of big and goofy and it helps cause I mean it when I say it). I am kind of known for it. I told my daughter last night that I am going to be compelled to give the same speeches when she is 16 to whoever she is dating.\n` +
        'It sounds like both of your parents were very supportive and it has made what could have been a traumatic experience a really positive one. Be sure to give them extra hugs,\n' +
        'May I ask, have you introduced an SO to them? Did you date in HS?\n' +
        'Noteworthy advice given:\n' +
        'u/Lluxx\n' +
        'With that said:\n' +
        `"It has more to do with being safe (physically), pregnancy (big one) and STD's and waiting until such an age as the person can make more responsible decisions. This is less of a concern for this situation."\n` +
        "Sadly, homosexual relationships are not exempt from physical or emotional abuse. We've had some horrible stories on this subreddit of women who've ended up locked into a relationship with a truly foul person, and the perception that women (or queer people) can't be abusive can make it harder for them to see the abuse for what it is. If you're worried about keeping your daughter safe, the best thing to do is make sure she's aware of abuse and how to recognise it, aware that abusers are not always stereotypical and aware of being smart and safe in all relationships.\n" +
        "Similarly, although your daughter is probably not going to get pregnant, the idea that STIs aren't a threat to lesbians is a big misconception. Too many lesbians I know have assumed they're safe and never bothered with testing only to be hit with something later down the line. Making sure that your daughter is clear on the reality of the situation (i.e. lesbian sex might be less risky, but the risk is still very much there) will be a good way to avoid STIs because she'll know they're an issue and take appropriate precautions.\n" +       
        'With this:\n' +
        '"As a lesbian, if your 13 year old daughter started experimenting, where would you draw the line with sleepovers? I do know that kids will be kids, at the same time I do not feel it is right to encourage intense relationships at too young an age."\n' +
        "I can't really say, but treating all your kids equally (however that may be) is important. When I was growing up I was allowed complete freedom and my parents were never involved in my dating life. Sleepovers with anyone were never off limits. I feel like that early experience was really important for me to learn things like communication, honesty and how to recognise bullshit a mile off. My friends without that experience seemed to struggle a lot more when they did start dating, with the relationships often being very dramatic. But that's just my two cents - whatever you decide to do, if it's consistent and she's being treated like her siblings, that's good.\n" +
        'OPP:\n' +
        "Thank you! I hadn't even thought of STI's and how to prevent them in lesbian relationships.\n" +
        'I know there is a lot of pain in the LGBT which can lead people to make really screwed up decisions about how to deal with pain and anger. I come from a family that is a 7 layer burrito of problems. Hopefully I can help her avoid some of the traps.\n' +
        'You parents were very brave people! That feels like taking the net away to me. I know people can do that and everything works, but I get vertigo thinking about it.\n' +       
        '\n' +
        '\n' +
        'u/Lipgloss121:\n' +
        `Well I'm a parent my sons 12 and I think he's straight so no experience, not sure how you police sleep overs, but I'm a firm believer in "its my house and my rules" so you need to speak to her about the not dating till she's 16 rule (which I do think is a good idea).\n` +
        "One thing I would do if I was you is speak to the other girls parents, they have no right speaking to your daughter without your knowledge! and at 13 she's too young to be dealing with them on her own, if they're going to be awful.\n" +
        'OPP:\n' +
        'We are very much: "our house, our rules". At the same time, we do make exceptions depending on the circumstances.\n' +
        'Thank you for the advice about directly talking to the other girls mother. My daughter has requested us not to talk to them for the time being because she is afraid her friend will get into trouble, which I respect, the other girl is facing her own nightmare. (More thinking on this required). I need to work out some scenarios with her where if they continue to try and talk to my daughter or she grows concerned for her friend, my daughter will be more comfortable with us contacting them.\n' +
        'OPP on their dating rules:\n' +
        'I can only speak for our family (we live in Central VA). Dating is more a grown-up, one-on-one relationship experience. Before 16, kids can be more volatile and there can be a huge difference in maturity between kids. It is more likely to create huge drama which is a distraction from school, family and outside activities.\n' +
        'For our older kids, 16 in 2006, very few people actually dated (one-on-one, exclusive). That sort of dating pulled people out of the group. There were 15 or 20 people in their group and they would go do things together. I have since heard that sex was a regular part of the group, but the relationships were much more fluid. Not really dating.\n' +
        'As for the age of sixteen: it is for both boys and girls is the first step into adulthood (drivers licenses, later curfews), so with the new found freedom, we allow them to make there own choices in terms of one on one dating.\n' +
        'Hope that helps.\n' +
        "Edit: I am not sure what you mean by 'enforce'. Kids can chose to be defiant or not. We can't stop that. All we can do is talk to them.\n" +
        "I think the term dating is confusing because, to us, it is not the same as 'seeing' someone. Having a BF or GF without a certain maturity level almost always assures infidelity, feelings of abandonment, and unneeded drama. This is separate from sex.\n" +
        'Update on the same post: 28 May 2015\n' +
        'I want to thank everyone on here. It has been a tremendous help.\n' +
        "My daughter came home yesterday and was a little distant. She and I sat down and were able to talk and we were able to communicate more. She had felt judged by my wife (my wife is angry about this because she fells that our daughter has/had been influenced by a friend in my daughter's group who had 'declared' herself a lesbian during a fifth grade sleepover, which is obviously a sign of something, but that is another thread). My wife does not feel my daughters feelings are organic, but more of a social clique development by this other girl which, of course, drove a small wedge into the conversation. Unfortunately, my wife's first reaction was not the best, but I was able to show my daughter, in our alone conversation, those were not my feelings and that her mother will come around.\n" +
        "As a side note: I was able to talk to my wife yesterday, alone, and made her understand our daughters feelings are true whether 'organic' or not, love is love, and this is not a bad thing. (Got a bit of work to do there, 'first love' did not go over too well. Yet another thread.)\n" +
        "I emphasized our no dating rule under 16 was more about avoiding chaos, hurt feelings and concentrating on school, and it had nothing to do with who she had feelings for or expressed them to. It was a maturity thing, not only hers but the people around her. She had confused my wife's opinion with mine and so therefore had felt we were doing something different to her because of who she is in love with. I am so glad I brought it up! I also reminded her that I fully expect her to be with the people she likes, parties, dances, whatever, regardless of what other people say.\n" +
        "We also discussed the nature of dating and that people expect fidelity when dating, and kids are incapable of it. Being romantic (sexual or feelings) is a good thing. Making a commitment (via dating) at a young age is not. It actually teaches kids how to fail at keeping commitments. Almost all of the high school romances I saw ended because one or another the partners lied or cheated, and that she probably saw a lot of that drama her school, which she has. Young people tend practice being in bad relationships, not good ones not because they are bad people, but because being young is more fun. And since no one wants to hurt anyone, they tend to lie. I also said that any relationship you get into before finishing school is almost guaranteed to have an expiration date. Therefore, she should see who she wants, be kind, be honest, be loving, but don't set yourself or someone else for pain you can foresee. As mentioned in other posts, I was able to give good examples in her sister and brother (who are in great relationships right now) and their friends, who are still all around. I also said that this rule until she is sixteen. After that, depending on maturity and grades, it is advice.\n" +
        "And this is where AL changed me: I told her I was wrong about the sleepovers. Having a no sleepover rule was wrong, and she needed to be with her friends. But that if she was crushing on someone, no one-on-one sleepovers and no group sleepovers with crushes. (I am seriously editing here, it wasn't just Dad declaring this). She caught on when I said that I could no more condone the sleepover with crushes than if you asked me to get a motel room for you and your crush. She brought up that it was the same reason we did not let her older sister sleepover with guys as teenagers and that she understood it was the same thing.\n" +
        'She also asked to invite her friend over this weekend, and I said of course. Later on, my wife pointed out that we will need to meet her parents, which we do for all visiting friends. Killing two birds with one stone. This will be fun (/sarcasm).\n' +
        'We also briefly discussed STI protection. For the other kids, I purchased a package of condoms and we practiced rolling them and unrolling the on a wooden spoon, along with annual discussions. But that because I am still learning what is important for girl oriented stuff (thanks for the heads up), I still have to learn some things before we talk. From the look in her face, I said: "It looks like you would rather crawl through a sewage treatment plant on your lips." (stolen line) It made her laugh. She suggested google, and I said I wanted to filter some material out first (this made me laugh to myself for very hetero male reasons...apologies).\n' +
        "She also said to me that she didn't know what she was, she may like boys at a later date, she didn't know. I gave her insight into my own experience. I have never been homophobic. In college in the early 80s, my then girlfriend and I became friends with the gay crowd because, frankly, they were more fun to talk to and at parties. After we broke up, because of these friendships (and getting hit on a lot), I started to question my own sexuality. One friend in particular, explained over the course of a few months, that I would make a miserable homosexual, just as he had made a miserable heterosexual. Without as much detail, I told her that at 21 I had experienced the same feelings about sexuality and not to worry about the labels, just the feelings, these decisions will make themselves. (Regrettably, I am still biased against bisexuals..I never know which way they are pointed j/k)\n" +
        'I wanted to thank everyone, and I mean everyone, for helping me. I think I have known for a while that this would become an issue and was allowed myself to be blinded-sided, hoping to avoid this issue (edit again: hoping to avoid the reaction I realized her mother might have). Times have changed, I am glad my daughter is going through this now and not before, especially because her Dad can pretend to be smarter than he is by posting anonymously on the internet!\n' +
        'Thank you, again,\n' +
        'Love, -j\n' +
        'Edit: With how people are reacting I decided to charge the mood spoiler\n' +
        'Once again I am not the OP!!!\n' +
        '\n' +
        'Links:\n' +
        '/u/throwawayjoesixpack/\n' +
        '/u/Lluxx/\n' +
        '/u/Lipgloss121/\n'
    }

    await supertest(app).post("/extract").send({ url: url })
      .expect(200)
      .then((response) => {

        // Check data
        expect(response.body.site).toBe(post.site);
        expect(response.body.url).toBe(post.url);
        expect(response.body.content).toBe(post.content);
      });
  })

  describe("Error Checks", () => {
    // Contains "reddit.com" but not "/comments/"
    test("Fully Invalid Reddit link", async () => {
      url = "https://www.reddit.com/";
      await supertest(app).post("/extract").send({ url: url })
        .expect(500)
        .then((error) => {
          expect(error.body.error).toBe("Reddit link is not a post");
      });
    });
  
    // Contains "reddit.com" and "/comments/" but leads to an invalid post (such as a deleted one)
    test("Invalid Reddit link past initial url checks", async () => {
      url = "https://www.reddit.com/comments/hebfklawebflaiwbefklawbefthisshouldntwork/";
      await supertest(app).post("/extract").send({ url: url })
        .expect(500)
        .then((error) => {
          expect(error.body.error).toBe("Reddit link invalid");
      });
    });

  });
});
