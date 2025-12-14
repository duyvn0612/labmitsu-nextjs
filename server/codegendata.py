import random
import json
from datetime import datetime, timedelta

# Tạo 100 ngày gần đây
def generate_last_100_days():
    today = datetime.today()
    return [(today - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(100)][::-1]

# Danh sách nội dung mẫu
contents = [
    ("LỚP HỌC", "ĐANG DIỄN RA", "VUI LÒNG GIỮ YÊN LẶNG"),
    ("PHÒNG HỌP", "CUỘC HỌP", "ĐANG DIỄN RA"),
    ("HÀNH LANG", "VUI LÒNG", "KHÔNG CHẠY NHẢY"),
    ("THƯ VIỆN", "GIỮ TRẬT TỰ", "KHÔNG GÂY ỒN"),
    ("NHÀ ĂN", "XẾP HÀNG", "GIỮ VỆ SINH"),
    ("KHU VỰC", "KHÔNG PHẬN SỰ", "MIỄN VÀO"),
    ("SỰ KIỆN", "NGÀY HỘI VIỆC LÀM", "TẠI HỘI TRƯỜNG"),
    ("THANG MÁY", "VUI LÒNG", "ĐEO KHẨU TRANG"),
    ("THOÁT HIỂM", "THEO MŨI TÊN", "RA NGOÀI AN TOÀN"),
    ("TIẾP KHÁCH", "VUI LÒNG", "LIÊN HỆ QUẦY LỄ TÂN")
]

modes = ["auto", "normal"]
statuses = ["Active", "Inactive", "Maintenance"]
types = ["Chào mừng", "Hướng dẫn", "Cảnh báo", "Thông báo"]
locations = [
    "Phòng học A1-101",
    "Phòng họp Ban giám hiệu",
    "Hành lang tầng 2",
    "Thư viện trung tâm",
    "Nhà ăn sinh viên",
    "Phòng kỹ thuật",
    "Hội trường lớn",
    "Thang máy khu B",
    "Lối thoát hiểm Tầng 5",
    "Sảnh lễ tân"
]

# Tạo dữ liệu VMS
vms_data = []
dates = generate_last_100_days()

for i in range(10):
    vms = {
        "id": i + 1,
        "name": f"VMS-{101 + i}",
        "location": locations[i],
        "mode": random.choice(modes),
        "status": random.choice(statuses),
        "dailyData": [],
    }
    content1, content2, content3 = contents[i]

    for date in dates:
        people_in = random.randint(20, 300)
        people_out = random.randint(20, 300)

        daily = {
            "date": date,
            "content1": content1,
            "content2": content2,
            "content3": content3,
            "type": types[i % len(types)],
            "priority": random.randint(1, 5),
            "note": "" if random.random() > 0.3 else "Kiểm tra định kỳ",
            "peopleIn": people_in,
            "peopleOut": people_out
        }
        vms["dailyData"].append(daily)

    vms_data.append(vms)

# Xuất ra file JSON
with open("vms_100_days_data.json", "w", encoding="utf-8") as f:
    json.dump(vms_data, f, indent=2, ensure_ascii=False)

print("✅ Đã tạo xong dữ liệu và lưu vào vms_100_days_data.json")
