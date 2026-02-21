
// Global Constants for Legacy Logic
window.SystemUserID = 898; 
window.schema = 'mOTWKsjsWG2RP0SkZB3wnA%3D%3D';
window.User = "admin@admin.com";
window.CompanyBranchID = 1;
window.EnterSubmitsFormsOnThisPage = false;
window.UserRoomID = 5692;
window.UserRoomStatus = 1;
window.RoomID = 38;
window.AppVersion = "3.1.0";
window.GuideLink = null;

// Optimized Pool - Direct execution for now
function Pool(n) {
    this.addWorkerTask = function(task) { 
        // Direct execution for performance in this demo environment
        GetOrPostAsync(task.startMessage.method, task.startMessage.url, task.startMessage.data, task.startMessage.token)
            .then(res => task.callback({ data: { status: true, response: res } }))
            .catch(err => task.callback({ data: { status: false, response: err } }));
    };
}
window.pool = new Pool(4);

function GetOrPostAsync(method, url, data, token) {
    return new Promise((resolve, reject) => {
        // Use jQuery AJAX if available (loaded via CDN)
        if (typeof $ !== 'undefined' && $.ajax) {
            $.ajax({
                url: url,
                type: method,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: method === "GET" ? data : JSON.stringify(data),
                headers: { RequestVerificationToken: token },
                success: (n) => resolve(n),
                error: (n) => {
                    console.warn("Legacy API Mock: Failed to fetch " + url);
                    // Mock success for demo purposes if backend isn't real
                    resolve({ success: true, message: "Mock success response" }); 
                }
            });
        } else {
            // Fallback for demo
            console.log(`[Legacy API] ${method} ${url}`, data);
            resolve({});
        }
    });
}

function StoreData(n, t) { window.localStorage && localStorage.setItem(n, t); }
function GetData(n) { return window.localStorage ? localStorage.getItem(n) : null; }

function Notify(n, t) {
    if (typeof Noty !== 'undefined') {
        new Noty({
            text: t || "Success",
            type: n ? "success" : "error",
            theme: "metroui",
            timeout: 3000,
            progressBar: true
        }).show();
    } else {
        console.log("NOTY:", n ? "SUCCESS" : "ERROR", t);
    }
}

function Inform(t) {
    if (typeof Noty !== 'undefined') {
        new Noty({ text: t, type: "info", theme: "metroui", timeout: 4000 }).show();
    } else {
        console.log("INFO:", t);
    }
}

// Formatting Utilities
function formatCurrency(n) {
    var t = n.toFixed(2).toString().split(".");
    return t[0] = t[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","), t.join(".")
}

function formatDateTime(n) {
    var r, u;
    if (n = new Date(n), n.getFullYear() <= 1970) return "-";
    var t = n.getHours(),
        i = n.getMinutes(),
        f = t >= 12 ? "pm" : "am";
    return t = t % 12, t = t ? t : 12, i = i < 10 ? "0" + i : i, r = t + ":" + i + " " + f, u = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], `${u[n.getMonth()]} ${n.getDate()}, ${n.getFullYear()} ${r}`
}

function formatDate(n) {
    if (n = new Date(n), n.getFullYear() <= 1970) return "-";
    return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][n.getMonth()]} ${n.getDate()}, ${n.getFullYear()}`
}

// --- SignalR & Chat Logic (Adapted) ---
// Global array to store active users for chat
window.___ActiveSystemUsers___ = [];
window.___ConnectedUsers___ = [];
window.myConnectionID = "";

// Initialize SignalR if available
document.addEventListener("DOMContentLoaded", function() {
    if (typeof signalR !== 'undefined') {
        console.log("Initializing SignalR...");
        
        const chatConnection = (new signalR.HubConnectionBuilder)
            .withUrl("/chatHub") // This URL would need to be real
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.None)
            .build();

        // Start connection (Mocked for safety in demo to prevent console errors loop)
        // chatConnection.start().catch(err => console.log("SignalR Connection Error (Expected in Demo):", err));

        // Event Handlers
        chatConnection.on("ReceiveMessage", function(n, t) {
            Notify(true, `Message from ${n.username}: ${t}`);
        });

        // Expose to window
        window.chatConnection = chatConnection;
    }
});

// --- TODO Logic (Pure JS Implementation for Dashboard) ---
// This function can be called by React components to sync with the legacy data structure
function GetLegacyTodos() {
    var key = `todos-${window.schema}-${window.SystemUserID}`;
    var data = GetData(key);
    if(data) {
        try {
            return JSON.parse(data);
        } catch(e) { return []; }
    }
    return [];
}

function SaveLegacyTodos(todos) {
    var key = `todos-${window.schema}-${window.SystemUserID}`;
    StoreData(key, JSON.stringify(todos));
}
