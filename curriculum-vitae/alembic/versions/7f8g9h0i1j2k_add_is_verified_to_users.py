"""Add is_verified column to users table

Revision ID: 7f8g9h0i1j2k
Revises: 6e7f8g9h0i1j
Create Date: 2026-02-18 10:00:00.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "7f8g9h0i1j2k"
down_revision: str | Sequence[str] | None = "6e7f8g9h0i1j"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Add is_verified column.

    Existing users are set to True (already validated by prior usage).
    New users created via the ORM default to False (requires email verification).
    """
    op.add_column(
        "users",
        sa.Column(
            "is_verified",
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),  # existing rows → verified by default
        ),
    )
    # After backfilling, change server_default to false for future SQL-level inserts
    op.alter_column("users", "is_verified", server_default=sa.false())


def downgrade() -> None:
    """Remove is_verified column."""
    op.drop_column("users", "is_verified")
