function getFCB() {
    // fcb
    let fcb = 0;
    const paintMetrics = window.performance.getEntriesByType("paint");
    if (paintMetrics !== undefined && paintMetrics.length > 0) {
        paintMetrics.forEach((paintMetric) => {
            paintMetric.name === "first-contentful-paint" && (fcb = paintMetric.startTime);
        });
    }
    return fcb;
}

function getResources() {
    // Get a list of "resource" performance entries
    const resources = window.performance.getEntriesByType("resource");
    if (resources === undefined || resources.length <= 0) {
        console.log("= Calculate Load Times: there are NO `resource` performance records");
        return [];
    }

    console.log("= Calculate Load Times");
    const returnValue = [];
    for (let i = 0; i < resources.length; i++) {
        returnValue.push({
            resourceName: resources[i].name,
            time: resources[i].duration,
        });
    }
    return returnValue;
}

function PerfAnalytics(apiAddress) {
    window.addEventListener("load", function(){
        // Check performance support
        if (window.performance === undefined) {
            console.log("= Calculate Load Times: performance NOT supported");
            return;
        }



        const perfEntries = window.performance.getEntriesByType("navigation")[0];

        const analytics = {
            ttfb: perfEntries.responseStart - perfEntries.fetchStart,
            fcb: getFCB(),
            domLoad: perfEntries.domContentLoadedEventEnd - perfEntries.domContentLoadedEventStart,
            windowLoad: perfEntries.loadEventStart - perfEntries.fetchStart,
            resources: getResources(),
        };


        fetch(`${apiAddress}/analytics`, {
            method : 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({...analytics, id: window.location.href})
        });
    }, false);
}

export { PerfAnalytics }
