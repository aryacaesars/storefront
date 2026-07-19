-- CreateTable
CREATE TABLE "platform_theme_configs" (
    "template_id" TEXT NOT NULL,
    "base_config_json" JSONB NOT NULL,
    "preview_config_json" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_theme_configs_pkey" PRIMARY KEY ("template_id")
);
