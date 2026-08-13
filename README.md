# Toán Agent

Demo website công cụ toán học tự phát triển. Trang chủ bắt đầu ở mốc demo 11/08/2026; workflow `Agent demo — 20 minutes` tạo thêm một công cụ sau mỗi 10 phút và dừng ở 13/08/2026.

## An toàn

Agent chỉ được chọn từ danh mục công cụ có bộ tính toán đã kiểm duyệt. Khóa OpenAI phải được lưu dưới tên `OPENAI_API_KEY` trong GitHub Actions secrets và không bao giờ được commit vào repository.
