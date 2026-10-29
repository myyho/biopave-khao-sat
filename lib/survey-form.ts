export const GOOGLE_FORM_RESPONSE_URL = "https://docs.google.com/forms/d/e/1FAIpQLScT_I6kMTSO4nO-YuuGTes80Yc7E2DJw92dSu4xup-p6WbzpA/formResponse";
export const OTHER_OPTION = "__other_option__";

export const audienceOptions = [
  "Chuyên gia/ doanh nghiệp xây dựng/ kiến trúc sư/ kinh doanh VLXD",
  "Chủ hộ gia đình/ người quan tâm không gian sống",
] as const;

export const problemOptions = [
  "Sân nhà / Sân thượng bị đọng vũng nước lâu khô, gây trơn trượt nguy hiểm",
  "Nắng nóng hắt xuống sàn gạch làm không gian trong nhà bị hầm hập, oi bức",
  "Bồn cây cảnh mau khô đất vào ngày nắng hạn, tốn công tưới nước liên tục",
  "Sân vườn/Nhà tắm bị đóng rêu mốc, mảng bẩn, tốn nhiều công sức chà rửa",
] as const;

export const priorityOptions = [
  "Tính thẩm mỹ & Phong cách kiến trúc",
  "Độ an toàn chống trượt (Bảo vệ người già & trẻ em)",
  "Khả năng làm mát / Giảm nhiệt độ sàn nhà",
  "Độ dễ dàng vệ sinh & Không bám rêu mốc",
] as const;

export const treeConcernOptions = [
  "Sợ rễ cây làm nứt vỡ khối gạch sau thời gian dài sử dụng",
  "Sợ gạch bị đóng rong rêu hoặc làm đọng nước gây sinh muỗi",
  "Sợ giá thành cao hơn các loại bồn cây xây bê tông thông thường",
] as const;

export const materialConcernOptions = [
  "Lo ngại về độ bền cơ học và khả năng chịu tải (sợ giòn, mau vỡ)",
  "Lo ngại về an toàn vệ sinh & mùi hôi tanh từ vỏ hải sản",
  "Lo ngại về thẩm mỹ mảng màu không đồng đều như gạch công nghiệp",
] as const;

export const proofOptions = [
  "Được nhận Bộ mẫu thử (Sample Kit) tận nơi để tự rưới nước kiểm tra",
  "Được xem báo cáo kiểm định kỹ thuật Quatest về độ bền và an toàn môi trường",
  "Được đến xem trực tiếp công trình thử nghiệm (Living Lab) sau một trận mưa lớn",
] as const;

export type Survey = {
  email: string;
  name: string;
  phone: string;
  audience: string;
  problems: string[];
  problemsOther: string;
  priority: string;
  treeConcern: string;
  treeConcernOther: string;
  materialConcerns: string[];
  materialConcernsOther: string;
  proof: string;
  proofOther: string;
  consent: boolean;
  website: string;
};

export function toGoogleFormBody(data: Survey): URLSearchParams {
  const body = new URLSearchParams();
  body.set("emailAddress", data.email);
  body.set("entry.273687989", data.name);
  body.set("entry.997652286", data.phone);
  body.set("entry.1454477984", data.audience);
  for (const item of data.problems) body.append("entry.1400762379", item);
  if (data.problems.includes(OTHER_OPTION)) body.set("entry.1400762379.other_option_response", data.problemsOther.trim());
  body.set("entry.2066649427", data.priority);
  body.set("entry.1558420696", data.treeConcern);
  if (data.treeConcern === OTHER_OPTION) body.set("entry.1558420696.other_option_response", data.treeConcernOther.trim());
  for (const item of data.materialConcerns) body.append("entry.70805562", item);
  if (data.materialConcerns.includes(OTHER_OPTION)) body.set("entry.70805562.other_option_response", data.materialConcernsOther.trim());
  body.set("entry.330441103", data.proof);
  if (data.proof === OTHER_OPTION) body.set("entry.330441103.other_option_response", data.proofOther.trim());
  return body;
}
