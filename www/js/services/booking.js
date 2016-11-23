angular.module('SpaceApp.services')

.factory('BookingService', function (ParkingService, $q, $http, $rootScope, $filter) {

    var bookings = [];
    var initiated = false;
    var count = 0;



    var Booking = function (park) {
        this.id = genBookID();
        this.name = '';
        this.info = 'booking-creation';
        this.from = new Date();
        this.to = new Date();
        this.totDays = this.from - this.to;
        this.status = 'pending';
        this.plateNo = '';
        this.type = '';
        this.note = '';
        this.trn = getTRN();
        this.park = park;
        this.qr = getQR();
        this.bookID = '';
        this.tranID = '';
        this.services = [];
        return this;
    }


    var setPark = function (park) {
        this.park = park;
    }
    var getQR = function () {

        return (this.qr) ? this.qr : {
            code: genQrCode(),
            image: 'img/defqr.png'
        };
    }

    var getTRN = function () {

        return (this.trn) ? this.trn : {
            id: genTransNo(),
            status: 'new',
            amount: '0',
            date: new Date(),
            update: new Date(),
            orno: genOrNo()
        };
    }


    var get = function (pid) {
        //logme({
        //	pid
        //}, "get booking by id:" + pid);
        if (pid === null)
            return null;

        if (!initiated) {
            init();
            console.log("initiate local bookings");
        }

        for (var i = 0; i < count; i++) {
            console.log("-------------- booking [" + i + "] booking.id = " + bookings[i].id);
            if (parseInt(bookings[i].id) === parseInt(pid)) {
                console.log("-------------- found!");
                return bookings[i];
            }
        }

        console.log("-------------- notfound!");
        return null;
    }


    var save = function (nb) {
        var result = {};
        return $q(function (resolve, reject) {
            try {
                getBookings();
                console.log("-------------- local booking  ---> count : " + bookings.length);
                var expCount = bookings.length + 1;
                result.booking = nb;
                bookings.push(nb);

                console.log("-------------- push count ---> " + bookings.length);



                window.localStorage.setItem('bookings', JSON.stringify(bookings));


                if (bookings.length === expCount) {
                    console.log("-------------- create booking success <--- match count: " + expCount);
                    result.status = 'ok';
                    result.bookings = getBookings();
                    resolve(result);
                } else {

                    result.status = 'fail';
                    result.error = "UnExpected Count!" + expCount;

                    console.log("-------------- booking failed <--- error : " + result.error);
                    reject(result);
                }

            } catch (e) {
                result.status = 'fail';
                result.error = "Catch E:" + e;
                console.log("-------------- Error: create booking exception--> " + result.error);
                reject(result);

            }
        })

    }

    var update = function (ob, nb) {
        var result = {};
        var expCount = bookings.length;
        var isFound = false;
        var oldBooking = '';
        console.log("-------------- update ---> old:" + JSON.stringify(ob) + " new: " + JSON.stringify(nb));
        return $q(function (resolve, reject) {
            try {
                if (!initiated) {
                    init();
                }

                if (nb === null) {
                    result.status = 'fail';
                    result.error = "null params!";
                    reject(result);
                    return;
                }

                oldBooking = get(nb.id);
                if (oldBooking === undefined) {
                    bookings.push(nb);
                }
                oldBooking = angular.copy(nb);

                if (updateParkingSlotStatus(nb.park) === -1) {
                    result.status = 'fail';
                    result.error = "------------------------  parking slot status update failed!";
                    reject(result);
                } else {
                    window.localStorage.setItem('bookings', JSON.stringify(bookings));
                    if (bookings.length === expCount) {
                        console.log("------------------------  update booking success <--- exp count: " + expCount);
                        result.status = 'ok';
                        resolve(result);
                    } else {
                        console.log(" booking failed <--- exp count: " + expCount);
                        result.status = 'fail';
                        result.error = "UnExpected Count!" + expCount;
                        reject(result);
                    }
                }

            } catch (e) {
                console.log("update booking ---> error : " + e);
                result.status = 'fail';
                result.error = "Catch E:" + e;
                reject(e);
            }
        })

    }

    function updateParkingSlotStatus(park) {
        var parking = ParkingService.get(park.id) || {};
        console.log("updateParkingSlotStatus:" + JSON.stringify(park));

        if (parking === null || parking.slots === null) {
            console.log("NULL param!");
            return null;
        }

        console.log("updating parking lot status");

        for (var i = 0; i < parking.slots.length; i++) {
            if (parking.slots[i].no === park.no) {
                parking.slots[i].status = park.status;
                console.log("found slot id:" + park.no + " updating the status to:" + park.status);
                ParkingService.updateParking(parking);
                return 1;
            }
        }
        console.log("parking.slot.no not found!");
        return -1;

    }

    function init() {
        initiated = true;
        var saved = window.localStorage.getItem('bookings');
        if (saved === null) {
            console.log("no local bookings record found[" + saved + "]");

        } else {
            bookings = angular.copy(JSON.parse(saved));
            count = bookings.length;
            console.log("found local bookings count:" + count);
        }
    }

    function getBookings() {
        init();

        console.log("getBookings :" + count);

        return bookings;

    }

    function genBookID() {
        var fmt = "hh";
        if (!initiated)
            init();
        if (this.id) {
            this.bookID = this.id;
        }

        var cnt = bookings.length + 1;
        var td = new Date();
        this.bookID = leftZeroPad($filter('date')(td, fmt, "") + cnt, 5);
        //logme({
        //	BID
        //}, "genBookID");
        //this.bookID = BID;
        console.log("bookid--->" + this.bookID);

        return this.bookID;
    }

    function genTransNo() {
        var fmt = "mmss";
        var td = new Date();


        this.tranID = parseInt(this.bookID) + "" + leftZeroPad($filter('date')(td, fmt, ""), 5);
        //this.trn.id = TRNNO;
        //this.tranID = TRNNO;
        //this.tranID ='
        console.log("---------------------- TRNNO [" + this.tranID + "]");
        return this.tranID;

    }

    function genQrCode() {
        var fmt = "hhmmss";
        var td = new Date();

        var QRC = parseInt(this.bookID) + "" + leftZeroPad($filter('date')(td, fmt, ""), 9);
        console.log("---------------------- QRCODE [" + QRC + "]");
        //this.qr.code = QRC;
        return (QRC);
    }

    function genOrNo() {
        var fmt = "hhsss";
        var td = new Date();

        var ORNO = parseInt(this.bookID) + "" + leftZeroPad($filter('date')(td, fmt, "") + "" + parseInt(this.tranID), 9);

        console.log("---------------------- ORNO [" + ORNO + "]");
        //	this.trn.orno = ORNO;
        return (ORNO);

    }

    function cleanUp() {
        this.id = '';
        this.name = '';
        this.info = '';
        this.from = '';
        this.to = '';
        this.totDays = '';
        this.status = '';
        this.plateNo = '';
        this.type = '';
        this.note = '';
        this.trn = '';
        this.park = '';
        this.qr = '';
        this.bookID = '';
        this.tranID = '';
        this.services = [];

        return this;
    }

    function leftZeroPad(n, len) {
        var num = parseInt(n, 10);
        len = parseInt(len, 10);
        if (isNaN(num) || isNaN(len)) {
            return n;
        }
        num = '' + num;
        while (num.length < len) {
            num = '0' + num;
        }
        return num;
    };



    return {
        initialize: init,
        clear: cleanUp,
        setPark: setPark,
        create: Booking,
        update: update,
        delete: function (b) {
            bookings.splice(bookings.indexOf(b), 1);
        },
        fetch: getBookings,
        getTypes: function () {
            return [{
                name: 'empty',
                value: 'empty'
					}, {
                name: 'perishable',
                value: 'perishable'
					}];
        },
        save: save,
        get: get,
        getId: function () {
            return (this.id) ? this.id : genBookID();
        },
        getTRN: getTRN,
        getPark: function () {
            return (this.park)
        },
        getQR: getQR
    }

});