// #region XP_TABLE
const XP_TABLE = [{
	level: 100,
	xp: 14391160
}, {
	level: 101,
	xp: 15889109
}, {
	level: 102,
	xp: 17542976
}, {
	level: 103,
	xp: 19368992
}, {
	level: 104,
	xp: 21385073
}, {
	level: 105,
	xp: 23611006
}, {
	level: 106,
	xp: 26068632
}, {
	level: 107,
	xp: 28782069
}, {
	level: 108,
	xp: 31777943
}, {
	level: 109,
	xp: 35085654
}, {
	level: 110,
	xp: 38717661
}, {
	level: 111,
	xp: 42769801
}, {
	level: 112,
	xp: 47221641
}, {
	level: 113,
	xp: 52136869
}, {
	level: 114,
	xp: 57563718
}, {
	level: 115,
	xp: 63555443
}, {
	level: 116,
	xp: 70170840
}, {
	level: 117,
	xp: 77474828
}, {
	level: 118,
	xp: 85539082
}, {
	level: 119,
	xp: 94442737
}, {
	level: 120,
	xp: 104273167
}];
// #endregion XP_TABLE

const wiki = "http://runescape.wiki/w/Special:Search?search=";
const img = chrome.runtime.getURL("assets/wiki.jpg");
let time = 0;

chrome.runtime.onMessage.addListener((request) => {
	if (request.type === "hiscore") {
		const skills = document.getElementsByTagName("td");
		chrome.storage.sync.get({
			rs3Virt: true,
			osrsVirt: true
		}, (items) => {
			if (items.osrsVirt && request.tab.url.includes("oldschool")) {
				if (request.tab.url.includes("oldschool") && request.tab.url.includes("compare")) {
					OSRS(skills);
				} else if (request.tab.url.includes("oldschool") && request.tab.url.includes("hiscorepersonal")) {
					OSRSolo(skills);
				}
			} else if (items.rs3Virt && !request.tab.url.includes("oldschool")) {
				RS3(skills);
			}
		});
	} else if (request.type === "market") {
		chrome.storage.sync.get({
			wikiLinks: true
		}, (items) => {
			if (!items.wikiLinks) {
				return;
			}
			market();
		});
	} else if (request.type === "item") {
		chrome.storage.sync.get({
			wikiLinks: true
		}, (items) => {
			if (!items.wikiLinks) {
				return;
			}
			item();
		});
	} else if (request.type === "news") {
		// const time = document.getElementsByTagName("time");
		// if (time[0].dateTime < time[1].dateTime) {
		chrome.storage.sync.get({
			newsPin: true
		}, (items) => {
			if (!items.newsPin) {
				return;
			}
			console.log("abc");
			// const style = document.createElement("style");
			// style.appendChild(document.createTextNode(""));
			// document.head.appendChild(style);
			const sheet = document.styleSheets[document.styleSheets.length - 1];
			const style = `{
					content: '📌';
					float: left;
					font-size: 13pt;
					color: transparent;
					text-shadow: 0 0 0 #e1bb34;
				}`;
			if (request.tab.url.includes("news")) {
				sheet.insertRule(`.index article:first-child::before ${style}`);
			} else {
				sheet.insertRule(`.index article:first-child::before ${style}`);
			}
		});
		// }
	}
});

function item() {
	const head = document.getElementsByClassName("item-description")[0];
	const a = document.createElement("a");
	a.href = wiki + encodeURIComponent(head.children[0].innerText);
	a.target = "_blank";
	const wikiNode = `<img src="${img}" width="32px" style="border-radius:8px;top:-8px;right:8px" />`;
	a.innerHTML = wikiNode;
	head.appendChild(a);
}

function market() {
	if (time) {
		return;
	}
	const table = document.getElementsByTagName("table")[0];
	if (!table) {
		return;
	}
	const wikiHead = document.createElement("th");
	wikiHead.style.padding = "10px";
	wikiHead.appendChild(document.createTextNode("Wiki"));
	const headRow = table.children[0].children.length - 1;
	table.children[0].children[headRow].appendChild(wikiHead);

	const rows = table.children[1].children;
	for (let i = 0; i < rows.length; i++) {
		const itemName = rows[i].children[0].children[0].children[0].title;
		const wikiLink = wiki + encodeURIComponent(itemName);
		// console.log(wikiLink);
		const wikiNode = `<a href="${wikiLink}" target="_blank"><img src="${img}" width="32px" style="border-radius:8px;" /></a>`;
		const td = document.createElement("td");
		td.innerHTML = wikiNode;
		td.style.paddingLeft = "17px";
		// if (headRow) {
		const span = rows[i].children[0].children[0].children[1];
		span.style = "width:0;white-space:nowrap;";
		if ((span.innerText.includes("...") && span.innerText.length > 21) || span.innerText.length >= 17) {
			span.innerText = `${span.innerText.replace("...", "").slice(0, -7)}...`.replace(" ...", "...");
		}
		// }
		td.classList.add("memberItem");
		table.children[1].children[i].appendChild(td);
	}
	time = 1;
}

function changeValue(s, i, v) {
	if (s[i].children[0].children[0]) {
		s[i].children[0].children[0].innerHTML = v.toLocaleString();
	} else {
		s[i].children[0].innerHTML = v.toLocaleString();
	}
}

function RS3Loop(skills) {
	for (let i = 2; i < skills.length; i++) {
		const level = (skills[i].children[0].children[0]) ? skills[i].children[0].children[0] : skills[i].children[0];
		if (level.text === "99") {
			const xpIndex = (i <= 83) ? i - 1 : i + 1;
			const xp = parseInt(skills[xpIndex].children[0].text.replace(/,/g, ""));
			let virtualLevel = level.text;
			for (let j = 0; j < XP_TABLE.length; j++) {
				if (xp > XP_TABLE[j].xp) {
					virtualLevel = XP_TABLE[j].level;
				}
			}
			changeValue(skills, i, virtualLevel);
		}
		if (i !== 83) {
			i = i + 2;
		}
	}
}

function RS3Total(skills) {
	const u1TotalLevel = (skills[2].children[0].children[0]) ? skills[2].children[0].children[0] : skills[2].children[0];
	const u2TotalLevel = (skills[84].children[0].children[0]) ? skills[84].children[0].children[0] : skills[84].children[0];
	let virtualTotal = 0;
	for (let i = 2; i < skills.length; i++) {
		if (i !== 2 && i !== 84) {
			const level = (skills[i].children[0].children[0]) ? skills[i].children[0].children[0] : skills[i].children[0];
			if (!isNaN(level.text)) {
				virtualTotal += parseInt(level.text);
			}
			//console.log(level.text, virtualTotal);
		}
		if (i !== 83) {
			i = i + 2;
		} else if (i === 83) {
			virtualTotal = (virtualTotal === 0) ? u1TotalLevel.text : virtualTotal;
			changeValue(skills, 2, virtualTotal);
			virtualTotal = 0;
		}
		if (i > 164 && !isNaN(virtualTotal)) {
			virtualTotal = (virtualTotal === 0) ? u2TotalLevel.text : virtualTotal;
			changeValue(skills, 84, virtualTotal);
		}
	}
}

function OSLoop(skills, start, skip, iskip) {
	for (let i = start; i < skills.length; i++) {
		const level = skills[i];
		if (level.innerText === "99") {
			const xpIndex = i + 1;
			const xp = parseInt(skills[xpIndex].innerText.replace(/,/g, ""));
			let virtualLevel = level.innerText;
			for (let j = 0; j < XP_TABLE.length; j++) {
				if (xp > XP_TABLE[j].xp) {
					virtualLevel = XP_TABLE[j].level;
				}
			}
			level.innerHTML = virtualLevel.toLocaleString();
		}
		if (i >= iskip) {
			break;
		} else {
			i = i + skip;
		}
	}
}

function OSTotal(skills, start, skip, iskip, solo = false) {
	let total = 0;
	for (let i = start; i < skills.length; i++) {
		const level = skills[i];
		if (solo && i !== start && i < iskip) {
			total += parseInt(level.innerText);
		} else if (!solo && (i !== 30 && i !== 36) && i < iskip) {
			total += parseInt(level.innerText);
		}
		if (i >= iskip) {
			skills[start].innerHTML = total.toLocaleString();
			break;
		} else {
			i = i + skip;
		}
	}
}

function RS3(skills) {
	RS3Loop(skills);
	skills = document.getElementsByTagName("td");
	RS3Total(skills);
}

function OSRS(skills) {
	OSLoop(skills, 30, 10, 290);
	OSLoop(skills, 36, 10, 290);
	skills = document.getElementsByTagName("td");
	OSTotal(skills, 30, 10, 290);
	OSTotal(skills, 36, 10, 290);
}

function OSRSolo(skills) {
	OSLoop(skills, 15, 4, 131);
	skills = document.getElementsByTagName("td");
	OSTotal(skills, 15, 4, 131, true);
}
