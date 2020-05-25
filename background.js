// vim: sw=4:ts=4:sts=4
var direction = 1;

browser.commands.onCommand.addListener(function(command) {
    if (command == "next-tab") {
        // move to index + 1
        direction = 1;
    } else if (command == "previous-tab") {
        // move to index - 1
        direction = -1;
    }

    // find tab that is currently open
    browser.tabs.query({currentWindow: true, active: true})
        .then(findNextTab, onError);
})

function findNextTab(currentTab) {
    // get the index of the next tab according to user input
    console.log(currentTab[0]);
    var nextIndex = currentTab[0].index + direction;

    browser.tabs.query({currentWindow: true})
        .then(allTabs => {
            // check if we're on the first or last tab
            // if we are, we wanna wrap around to the other extreme
            if (nextIndex < 0) {
                nextIndex = allTabs[allTabs.length - 1].index;
            } else if (nextIndex >= allTabs.length) {
                nextIndex = 0;
            }

            // switch to the index of the next tab
            browser.tabs.query({currentWindow: true, index: nextIndex})
                .then(switchTab, onError);
        }, onError);
}

function switchTab(nextTab) {
    if (nextTab.length) {
        browser.tabs.update(nextTab[0].id, {active: true});
    }
}

function onError(msg) {
    console.log(msg);
}
