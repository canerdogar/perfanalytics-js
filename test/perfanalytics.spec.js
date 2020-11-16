import { PerfAnalytics } from "../src/index";

describe("perfanalytics collects desired data and sends it", function () {

    let windowSpy;
    const entries = {
        paint : [{
            name: "first-contentful-paint",
            startTime : 123123
        }],
        navigation : [{
            responseStart : 14423,
            fetchStart : 2312,
            domContentLoadedEventEnd : 3213123,
            domContentLoadedEventStart : 123444,
            loadEventStart : 1233444,
        }],
        resource : [{
            name : 'dummy',
            duration : 12351123,
        }]
    }

    beforeEach(() => {
        windowSpy = jest.spyOn(window, "window", "get");
    });

    afterEach(() => {
        windowSpy.mockRestore();
    });

    test("bla bla", function () {
        windowSpy.mockImplementation(() => ({
            addEventListener: jest.fn((event, callback) => {
                callback();
            }),
            location : {
                href : 'perfanalytics-test.com.tr'
            },
            performance: {
                getEntriesByType: (type) => entries[type],
            }
        }));

        PerfAnalytics("apiAddress.com");

        expect(fetch.mock.calls.length).toEqual(1);
        const body = JSON.parse(fetch.mock.calls[0][1].body);
        expect(body.ttfb).toEqual(12111);
        expect(body.fcb).toEqual(123123);
        expect(body.domLoad).toEqual(3089679);
        expect(body.windowLoad).toEqual(1231132);
        expect(body.resources[0].time).toEqual(12351123);
        expect(body.resources[0].resourceName).toEqual("dummy");
    })

})
