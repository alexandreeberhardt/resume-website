"""Add import_count and bonus_imports columns to users

Revision ID: 8g9h0i1j2k3l
Revises: 7f8g9h0i1j2k
Create Date: 2026-02-19 10:00:00.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "8g9h0i1j2k3l"
down_revision: str | Sequence[str] | None = "7f8g9h0i1j2k"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Add import_count and bonus_imports columns to users table."""
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    existing_cols = [col["name"] for col in inspector.get_columns("users")]

    if "import_count" not in existing_cols:
        op.add_column(
            "users",
            sa.Column("import_count", sa.Integer(), nullable=False, server_default=sa.text("0")),
        )
    if "bonus_imports" not in existing_cols:
        op.add_column(
            "users",
            sa.Column("bonus_imports", sa.Integer(), nullable=False, server_default=sa.text("0")),
        )


def downgrade() -> None:
    """Remove import_count and bonus_imports columns from users."""
    op.drop_column("users", "bonus_imports")
    op.drop_column("users", "import_count")
