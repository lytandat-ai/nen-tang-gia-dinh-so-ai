-- Schema của community-service (database community_db). Bảng: post, comment, reaction.
-- ID dùng BIGINT; không có khóa ngoại sang bảng của service khác (user_id, family_id chỉ là giá trị tham chiếu).
-- Khóa ngoại comment.post_id và reaction.post_id nằm trong cùng community_db nên được phép; xóa bài thì xóa kèm bình luận và cảm xúc.
\connect community_db community_svc

CREATE TABLE IF NOT EXISTS post (
  post_id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  family_id  BIGINT       NOT NULL,
  user_id    BIGINT       NOT NULL,
  post_type  VARCHAR(20)  NOT NULL DEFAULT 'GENERAL'
             CHECK (post_type IN ('NEWS', 'ANNOUNCEMENT', 'GENERAL')),
  title      VARCHAR(255),
  content    TEXT         NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT now(),
  updated_at TIMESTAMP    NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_post_family_created ON post (family_id, created_at DESC);

CREATE TABLE IF NOT EXISTS comment (
  comment_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id    BIGINT    NOT NULL REFERENCES post (post_id) ON DELETE CASCADE,
  user_id    BIGINT    NOT NULL,
  content    TEXT      NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_comment_post_created ON comment (post_id, created_at);

-- Mỗi người một cảm xúc cho mỗi bài: ràng buộc UNIQUE (post_id, user_id).
CREATE TABLE IF NOT EXISTS reaction (
  reaction_id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id       BIGINT      NOT NULL REFERENCES post (post_id) ON DELETE CASCADE,
  user_id       BIGINT      NOT NULL,
  reaction_type VARCHAR(10) NOT NULL
                CHECK (reaction_type IN ('LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY')),
  created_at    TIMESTAMP   NOT NULL DEFAULT now(),
  updated_at    TIMESTAMP   NOT NULL DEFAULT now(),
  CONSTRAINT uq_reaction_post_user UNIQUE (post_id, user_id)
);
