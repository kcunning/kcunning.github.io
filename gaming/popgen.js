var getRandomItem = function (arr) {
    // Returns a random item from an array.
    return arr[Math.floor(Math.random()*arr.length)]
}

var getRandomGroup = function(names, vals) {
    // Returns a random item from a group, where not every item has an 
    // equal chance of being selected. Vals are the chances, and should be
    // one less than the length of `names`. The last value is assumed
    // to be whatever is left over after adding all the other numbers. 
    var n = Math.round(Math.random() * 100);
    var t = 0;
    for (let i = 0; i < vals.length; i++) {
        t += vals[i];
        if (n <= t) {
            return names[i]
        }
    }
    return names[names.length - 1]
}

var getAncestry = function() {
    // Returns a random ancesty. Percents based on:
    //  https://www.reddit.com/r/Pathfinder_RPG/comments/65yewi/golarion_populations_by_race_the_quickening_v21/
    races = ['elf', 'gnome', 'half-elf', 'halfling', 'half-orc', 'dwarf', 'human'];
    chances = [2, 1, 1, 2, 1, 3];
    name = getRandomGroup(races, chances);
    return(name)
}

var getSES= function() {
    // Returns a random socioeconomic status. 
    names = ['rich', 'affluent', 'comfortable', 'struggling', 'poor'];
    chances = [1, 10, 20, 40];
    ses = getRandomGroup(names, chances);
    return ses
}

var getGender = function() {
    // Returns a random apparent gender. Gender-neutral may be agender, androgynous, etc. 
    //   It's up to the GM.
    genders = ['male', 'female', 'gender-neutral'];
    chances = [45, 45];
    gender = getRandomGroup(genders, chances);
    return gender
}

var getAge = function() {
    // Returns a random age group. Children are only created in families!
    age_types = ['elder', 'adult'];
    chances = [20];
    age = getRandomGroup(age_types, chances);
    return age
}

var getJob = function(ses) {
    // Given an SES, returns a random job that suits that SES. 
    // Children can only ever be children. 
    ses_jobs = {
        'rich': ['nobility', 'land owner'],
        'affluent': ['shopkeep', 'artisan', 'merchant', 'landlord', 'service', 'tavern'],
        'comfortable': ['shopkeep', 'artisan', 'merchant', 'service', 'guard', 'temple',
            'tavern'],
        'struggling': ['worker', 'field hand', 'guard', 'service', 'tavern'],
        'poor': ['worker', 'field hand', 'beggar', 'service'],
        'child': ['child']
    }
    jobs = ses_jobs[ses];
    return jobs[Math.floor(Math.random() * jobs.length)];
}

var getRandomBuildingName = function(popGenData, vals) {
    // If this is called, we're assuming that the building is of the kind that gets a name. 
    //      Not every building gets a name! 
    // We're also assuming that we're getting a surname and a first name.     

    var noun1 = popGenData.nouns[Math.floor(Math.random()*popGenData.nouns.length)];
    var noun2 = popGenData.nouns[Math.floor(Math.random()*popGenData.nouns.length)];
    var adjective = popGenData.adjectives[Math.floor(Math.random()*popGenData.adjectives.length)];
    var gerund = popGenData.gerunds[Math.floor(Math.random()*popGenData.gerunds.length)];
    var firstname = vals.firstname;
    var surname = vals.surname;
    var subtype = vals.subtype.charAt(0).toUpperCase() + vals.subtype.slice(1);

    tpls = [
        `${noun1} and ${noun2}`,
        `The ${noun1}'s ${noun2}`,
        `The ${adjective} ${noun1}`,
        `${surname}'s ${subtype}`,
        `${subtype} by ${firstname}`,
        `The ${gerund} ${noun1}`
    ];

    tpl = tpls[Math.floor(Math.random()*tpls.length)];
    return tpl;
}

var getRandomBuilding = function(popGenData, vals={}) {
    // Gets a random buildinb based on the job sent. Some buildings get names!
    
    // Let's cover the people who live where they work / may not have a home. Everyone else lives in a residence. 
    job_subtypes = {
        'merchant': ['merchant'],
        'artisan': ['bookmaker', 'scribe', 
            'carpenter', 'tailor', 'glassblower', 'jewelry maker', 
            'artist', 'potter', 'cobbler', 'stonemason'],
        'temple': ['LG temple', 'NG temple', 'CG temple', 'LN temple', 
            'N temple', 'CN temple'],
        'shopkeep': ['General Goods', 'Magical Goods', 'Armor and Weapons', 'Bookseller'],
        'beggar': ['street', 'shack'],
        'tavern': ['Tavern', 'Inn'],
    }

    // Pick a random location
    if ('job' in vals & vals['job'] in job_subtypes) {
        
        btypes = job_subtypes[vals['job']]
        var i = Math.floor(Math.random()*btypes.length)
        var building = {'type': btypes[i]};
    } else {
        var building = {'type': 'residence'}
    }

    named_buildings = job_subtypes['shopkeep'];
    named_buildings = named_buildings.concat(job_subtypes['tavern']);

    var bvals = {
        'subtype': building.type,
        'firstname': vals.firstname,
        'surname': vals.surname
    }

    if (named_buildings.includes(building.type)) {
        building['name'] = getRandomBuildingName(popGenData, bvals);
    }



    return building
}

var getRandomPerson = function(popGenData, vals={}) {
    // Generates one random person. Values that can be overridden in vals:
    // anc = The ancesty 
    // ses = The socioeconomic status
    // job = The person's job
    // gender = The person's gender
    // age = The person's age
    // last = The person's family name


    if ('anc' in vals) {
        anc = vals.anc;
    } else {
        var anc = getAncestry();
    }
    if (anc.startsWith("half-")) {
        x = Math.round(Math.random() * 1);
        if (x == 0) {
            nameKey = "Hum"
        } else {
            base = anc.split('-')[1]
            nameKey = base[0].toUpperCase() + base.slice(1,3)
        }
    } else {
       nameKey = anc[0].toUpperCase() + anc.slice(1,3) 
    }

    if ('ses' in vals) {
        var ses = vals.ses;
    } else {
        var ses = getSES();
    }

    if ('job' in vals) {
        var job = vals.job;
    } else {
        var job = getJob(ses)
    }
    
    if ('gender' in vals) {
        var gender = vals.gender;
    } else {
        var gender = getGender();
    }
    if (gender == "gender-neutral") {
        // We don't have a collection of gender neutral names, so just pick one from either category
        if (Math.round(Math.random()*1) == 1) {
            genKey = "Fem";
        } else {
            genKey = "Mal";
        }
        fnkey = nameKey + genKey;
    } else {
        fnkey = nameKey + gender[0].toUpperCase() + gender.slice(1,3);
    }

    var person_age = vals['age']
    if ('age' in vals) {
        var age = vals.age;

    } else {

        var age = getAge();
    }

    if ('last' in vals) {
        ln = vals['last']
    } else {
        lnkey = nameKey + "Sur";
        var ln = getRandomItem(popGenData[lnkey]);
    }

    var fn = getRandomItem(popGenData[fnkey]);
    var traits = []
    do {
        t = getRandomItem(popGenData.traits);
        if (!(t in traits)) {
            traits.push(t)
        }
    } while (traits.length < 3)

    let pvals = {"first": fn, "last": ln, "traits": traits, "anc": anc, "gender": gender, "age": age, "ses": ses, "job": job};


    return pvals;
}

var getChildAnc = function(anc1, anc2='none') {
    // If the ancestries of the parents don't match, and the pair isn't elf-human / elf-orc, the children
    //      will be either ancestry. So, gnome+halfling will have gnome and halfling children, while human+orc
    //      will have all half-orc children.

    // If anc2 is none (because it wasn't sent), return anc1.
    if (anc2 == 'none') {
        return anc1
    }

    // If both are the same, return the same
    if (anc1 == anc2) {
        return anc1
    }

    // If one is human and the other is orc or elf, return half-{anc}
    ancs = [anc1, anc2];
    if ((ancs.includes('human')) & (ancs.includes('orc'))) {
        return 'half-orc'
    } 
    if ((ancs.includes('human')) & (ancs.includes('elf'))) {
        return 'half-elf'
    } 

    // If they're different, but neither is human, return one or the other anc
    n = Math.round(Math.random()*1);
    return ancs[n]
}

var getRandomFamily = function(popGenData, vals={}) {
    // Generates a random family. Some assumptions:
    //   - The first person determines the family name. This is for ease of keeping families together in the spreadsheet
    //   if it's sorted.
    //   - Adults share a 'job'. This is just for ease of sorting and determining houses. Might be updated one day.
    //   - Children ancestry has a special logic (see `getChildAnc`)
    //   - Families can have 1-2 adults, and 0-5 children. 
    //   - The family must live somewhere, even if that's on the street. 
    // First, generate a single person. If the person is a child, we switch their age to adult or elder.
    let family = {};
    if (!('age' in vals)) {
        vals['age'] = getAge();

    }

    const initialPerson = getRandomPerson(popGenData, vals);
    
    family['adults'] = [initialPerson]

    // Now, let's see if they have a spouse. For now, they will share the same age group.
    c = getRandomGroup([true, false], [90]);
    if (c == true) {

        svals = {'age': initialPerson.age, 'last': initialPerson.last, 'ses': initialPerson.ses}

        g = self.getRandomGroup(['opposite', 'same'], [85]);
        if (g == 'opposite' & initialPerson.gender == 'male') {
            gen = getRandomGroup(['female', 'gender-neutral'], [90])
        } else if (g == 'opposite' & initialPerson.gender == 'female') {
            gen = getRandomGroup(['male', 'gender-neutral'], [90])
        } else if (initialPerson.gender == "gender-neutral") {
            gen = getRandomGroup(['female', 'male', 'gender-neutral'], [45, 45])
        } else {
            gen = initialPerson.gender
        }
        svals['gender'] = gen;
        svals['job'] = initialPerson.job;



        let spouse = getRandomPerson(popGenData, svals);
        
        family['adults'].push(spouse)
    } 

    // If the primary person is an adult, give them between zero and five children.
    if (initialPerson.age == 'adult') {
        num = Math.round(Math.random()*10/2);    
    } else {
        num = 0
    }
    
    
    if (num > 0) {
        family['kids'] = []
    }
    for (var i=0; i < num; i++) {
        
        kvals = {'age': 'child', 'last': initialPerson.last, 'ses': initialPerson.ses};
        if (family['adults'].length == 1) {
            kvals['anc'] = getChildAnc(family.adults[0].anc)
        } else {
            kvals['anc'] = getChildAnc(family.adults[0].anc, family.adults[1].anc)
        }
        
        kvals['job'] = 'child'; // A child is only ever just a child

        family.kids.push(getRandomPerson(popGenData, kvals))

    }
    

    // Now, let's put the family in a building!
    var bvals = {'surname': family.adults[0].last, 'firstname': family.adults[0].first, 'job': family.adults[0].job}
    family.building = getRandomBuilding(popGenData, bvals)

    return family

}

var getOneFamily = function(popGenData) {
    // A function for generating one family and displaying it on the page
    var family = getRandomFamily(popGenData);

    var p = document.getElementById('fillme');

    template = `<h3>${family.adults[0].last} Family</h3>`;
    p.innerHTML = template;

    for (let i=0; i < family.adults.length; i++) {
        var per = family.adults[i];
        p.innerHTML += `<p>${per.first} ${per.last} (${per.job}), a ${per.ses} ${per.gender} ${per.anc} ${per.age} who is ${per.traits[0]}, ${per.traits[1]}, and ${per.traits[2]}.</p>`
    }

    if ('kids' in family) {
        for (let i=0; i < family.kids.length; i++) {
            var per = family.kids[i];
            p.innerHTML += `<p>${per.first} ${per.last}, a ${per.gender} ${per.anc} ${per.age} who is ${per.traits[0]}, ${per.traits[1]}, and ${per.traits[2]}.</p>`;
        }        
    }

    if ('name' in family.building) {
        p.innerHTML += `<p>Home: ${family.building.name} (${family.building.type})</p>`    
    } else {
        p.innerHTML += `<p>Home: ${family.building.type}</p>`
    }

}

var getBuilding = function(popGenData, vals) {
    // Every family lives in a house! Sometimes, that house is also a business, which is where
    // the family works.
    btypes = ['residence', 'merchant', 'artisan', 'temple', 'shopkeep', 'tavern']
    chances = [50, 20, 15, 5]
}

var getRandomSector = function(ses) {
    // A sector is where a building is located. 
    // The logic behind this: A house can sometimes be one step up or down from their current SES. So, 
    //  if your SES is 'middle class', you have a small chance of being in the 'poor' sector (maybe you're saving on rent.
    //  maybe you're in a house that was passed down) or 'upper middle class' (you've hit on hard times but were previously
    //  well-to-do, or you're stretching past your means)
    var sectors = ['slums', 'poor', 'middle class', 'upper middle class', 'exclusive', 'private estate']
    var sdict = {
        'poor': 'poor',
        'struggling': 'poor',
        'comfortable': 'middle class',
        'affluent': 'upper middle class',
        'rich': 'exclusive'
    }

    var baseSector = sdict[ses];
    var baseIndex = sectors.indexOf(baseSector);
    var possSectors = [sectors[baseIndex], sectors[baseIndex-1], sectors[baseIndex+1]];
    var sector = getRandomGroup(possSectors, [90, 5])
    return sector
}

var getRandomPopulation = function(popGenData, vals={'maxPop': 150}) {
    // Returns a random population of families. The max number will be fuzzy, stopping somewhere close to the max sent
    // in vals. If 0 is sent as a max, one family will always be generated. 

    var data = [];
    var ppl = 0;
    do {
        var building = getRandomFamily(popGenData);

        building.building.sector = getRandomSector(building.adults[0].ses);

        
        if ('kids' in building) {
            var kids = building.kids;
        } else {
            var kids = [];
        }
        ppl += building.adults.length + kids.length;

        // Now we need to add each person to the data array
        for (var i=0; i<building.adults.length; i++) {
            data.push(flattenPerson(building.adults[i], building))
        }

        if ('kids' in building) {
            for (var i=0; i<building.kids.length; i++) {
                data.push(flattenPerson(building.kids[i], building))
            }
        }

    } while (ppl < vals['maxPop']-3)
    

    return data
}

var flattenPerson = function(person, building) {
    // Flattens an single person object to a simple dictionary for ease of putting everyone into the CSV

    var traits = person.traits;

    var trait_text = `${traits[0]} / ${traits[1]} / ${traits[2]}`;

    var dd = {
        'Given Name': person.first,
        'Family Name': person.last,
        'Age': person.age,
        'Gender': person.gender,
        'Ancestry': person.anc,
        'Traits': trait_text,
        'SES': person.ses,
        'Job': person.job,
        'Building type': building.building.type,
        'Business Name': building.building.name,
        'Building Sector': building.building.sector,
    }

    

    return dd
}

var generatePopulation = function() {
    // The clicky function for generating a population. Updates the DOM to show a loading message, and
    // then call sthe CSV function.
    var loading = document.getElementById("loading");
    loading.innerHTML = "Getting your population...";
    
    
    setTimeout(function(){ 
        window.setTimeout(generateCSV(), 50);     
    },1);
}

var generateCSV = function() {
    // Generates a population based on the values in the DOM, and returns a CSV.

    var popNum = document.getElementById("popNum").value;

    var data = getRandomPopulation(popGenData, {'maxPop': popNum});

    let csvHeader = Object.keys(data[0]).join(',') + '\n'; // header row
    
    let csvBody = data.map(row => Object.values(row).join(',')).join('\n');

    loading.innerHTML += " Done!"    
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvHeader + csvBody);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'popGenTown.csv';
    hiddenElement.click();
}

// This fetches all the data for the script. Yes, I jammed it all into one JSON. 
fetch('alldata.json')
    .then((response) => response.json())
    .then(data => {popGenData = data;})