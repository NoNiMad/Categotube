let categories = [
{
    name: "Jeux",
    channels: ["UCWeg2Pkate69NFdBeuRFTAw", "UClOf1XXinvZsy4wKPAkro2A"],
    videos: []
}, {
    name: "Musique",
    channels: ["UCh5zlvB1pZyU3KYjEPC38KQ"],
    videos: []
}, {
    name: "Autres",
    channels: ["+"],
    videos: []
}];

function populateCategories() {
    let videoList = [];
    // For every video on the page
    $(".yt-shelf-grid-item").each(function(index, item) {
        let content     = $(item).find(".yt-lockup-content");
        let videoId     = $(item).children("div").data("context-item-id");
        let channel     = content.find("a[data-ytid]");
        let channelId   = channel.data("ytid");
        let channelName = channel.text();
        let title       = content.find("h3 a").text();
        
        videoList.push({
            channelId: channelId,
            channelName: channelName,
            title: title,
            videoId: videoId
        });
    });
    
    $.each(categories, function(catIndex, cat) {
        videoList = $.grep(videoList, function(vid, vidIndex) {
            if(cat.channels.includes(vid.channelId)) {
                cat.videos.push(vid);
                return false;
            }
            return true;
        });
    });
    
    $.each(categories, function(catIndex, cat) {
        if(cat.channels.includes("+")) {
            cat.videos = cat.videos.concat(videoList);
            return false;
        }
    });
}

function DOM_createVideoElement(vid) {
    let el = $("<li>");
    el.attr("class", "ctube-vid-el");
    
    // Thumb
    let thumb = $("<img>");
    thumb.attr("src", "https://i.ytimg.com/vi/" + vid.videoId + "/hq720.jpg");
    thumb.attr("alt", vid.title);
    el.append(thumb);
    
    let internalContainer = $("<div>");
    internalContainer.attr("class", "ctube-vid-int");
    
    // Title
    let title = $("<h3>");
    let titleLink = $("<a>");
    titleLink.attr("href", "/watch?v=" + vid.videoId);
    titleLink.text(vid.title);
    title.append(titleLink);
    internalContainer.append(title);
    
    // Channel Name / Link
    let channel = $("<a>");
    channel.attr("href", "/channel/" + vid.channelId);
    channel.text(vid.channelName);
    internalContainer.append(channel);
    
    el.append(internalContainer);
    return el;
}

function DOM_createColumn(cat) {
    let col = $("<div>");
    col.attr("id", "ctube-col-" + cat.name.toLowerCase());
    col.attr("class", "ctube-cat-col");
    
    // Category Header
    let header = $("<h2>");
    header.text(cat.name);
    col.append(header);
    
    // Video List
    let list = $("<ul>");
    col.append(list);
    
    return col;
}

function replacePageContent() {
    let container = $("#browse-items-primary");
    container.html("");
    
    // Debugging
    container.append(DOM_createRollbackBtn());
    
    $.each(categories, function(catIndex, cat) {
        let col = DOM_createColumn(cat);
        let vidList = col.children("ul");
        $.each(cat.videos, function(vidIndex, vid) {
            let vidEl = DOM_createVideoElement(vid);
            vidList.append(vidEl);
        });
        container.append(col);
    });
}

// Debugging
function DOM_createRollbackBtn() {
    let btn = $("<button>");
    btn.attr("id", "rollback");
    btn.text("Rollback");
    btn.click(rollback);
    return btn;
}

function rollback() {
    $("#browse-items-primary").replaceWith(saveContainer);
    $("#categorize").click(function() {
        console.log("Clicked");
        if(!populated) {
            populateCategories();
            populated = true;
        }
        console.log("Categories Populated");
        console.log("Replacing Page Content");
        replacePageContent();
    });
}

let populated = false;
function DOM_createCategorizeBtn() {
    let btn = $("<button>");
    btn.attr("id", "categorize");
    btn.text("Categorize");
    return btn;
}

let saveContainer = null;
function initialize() {
    $("#rollback").remove();
    $("#categorize").remove();
    
    let container = $("#browse-items-primary");
    container.prepend(DOM_createCategorizeBtn());
    saveContainer = container.clone();
    $("#categorize").click(function() {
        console.log("Clicked");
        if(!populated) {
            populateCategories();
            populated = true;
        }
        console.log("Categories Populated");
        console.log("Replacing Page Content");
        replacePageContent();
    });
}

initialize();























