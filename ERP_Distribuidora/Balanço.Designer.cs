namespace cadastro_livro
{
    partial class Balanço
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.Windows.Forms.ColumnHeader col_quant_vendido;
            System.Windows.Forms.ColumnHeader col_Qaunt_V;
            this.dateTimePicker1 = new System.Windows.Forms.DateTimePicker();
            this.dateTimePicker2 = new System.Windows.Forms.DateTimePicker();
            this.listView1 = new System.Windows.Forms.ListView();
            this.id = new System.Windows.Forms.ColumnHeader();
            this.col_fornecedor = new System.Windows.Forms.ColumnHeader();
            this.col_nome_prod = new System.Windows.Forms.ColumnHeader();
            this.col_cat_prod = new System.Windows.Forms.ColumnHeader();
            this.col_p_compra = new System.Windows.Forms.ColumnHeader();
            this.col_Data_C = new System.Windows.Forms.ColumnHeader();
            this.label4 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.listView2 = new System.Windows.Forms.ListView();
            this.col_id = new System.Windows.Forms.ColumnHeader();
            this.col_Nome_Prod_V = new System.Windows.Forms.ColumnHeader();
            this.col_Cli = new System.Windows.Forms.ColumnHeader();
            this.col_Cat_P = new System.Windows.Forms.ColumnHeader();
            this.col_P_V = new System.Windows.Forms.ColumnHeader();
            this.col_Data_V = new System.Windows.Forms.ColumnHeader();
            this.label6 = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.buttonEdit = new System.Windows.Forms.Button();
            this.buttonBack = new System.Windows.Forms.Button();
            this.label8 = new System.Windows.Forms.Label();
            this.label9 = new System.Windows.Forms.Label();
            this.label10 = new System.Windows.Forms.Label();
            this.textValorVendas = new System.Windows.Forms.TextBox();
            this.textQuantV = new System.Windows.Forms.TextBox();
            this.textValorInvestimento = new System.Windows.Forms.TextBox();
            this.textQuantC = new System.Windows.Forms.TextBox();
            this.label11 = new System.Windows.Forms.Label();
            this.textLucro = new System.Windows.Forms.TextBox();
            this.label12 = new System.Windows.Forms.Label();
            this.buttonDelet = new System.Windows.Forms.Button();
            this.col_Func_V = new System.Windows.Forms.ColumnHeader();
            this.col_Func_C = new System.Windows.Forms.ColumnHeader();
            col_quant_vendido = new System.Windows.Forms.ColumnHeader();
            col_Qaunt_V = new System.Windows.Forms.ColumnHeader();
            this.SuspendLayout();
            // 
            // col_quant_vendido
            // 
            col_quant_vendido.Text = "Quantidade";
            col_quant_vendido.Width = 50;
            // 
            // col_Qaunt_V
            // 
            col_Qaunt_V.Text = "Quant. Vendido";
            col_Qaunt_V.Width = 50;
            // 
            // dateTimePicker1
            // 
            this.dateTimePicker1.Location = new System.Drawing.Point(12, 37);
            this.dateTimePicker1.Name = "dateTimePicker1";
            this.dateTimePicker1.Size = new System.Drawing.Size(369, 23);
            this.dateTimePicker1.TabIndex = 0;
            // 
            // dateTimePicker2
            // 
            this.dateTimePicker2.Location = new System.Drawing.Point(419, 37);
            this.dateTimePicker2.Name = "dateTimePicker2";
            this.dateTimePicker2.Size = new System.Drawing.Size(369, 23);
            this.dateTimePicker2.TabIndex = 1;
            // 
            // listView1
            // 
            this.listView1.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.id,
            this.col_fornecedor,
            this.col_nome_prod,
            this.col_cat_prod,
            this.col_p_compra,
            col_quant_vendido,
            this.col_Data_C,
            this.col_Func_C});
            this.listView1.FullRowSelect = true;
            this.listView1.Location = new System.Drawing.Point(12, 130);
            this.listView1.Name = "listView1";
            this.listView1.Size = new System.Drawing.Size(369, 218);
            this.listView1.TabIndex = 17;
            this.listView1.UseCompatibleStateImageBehavior = false;
            this.listView1.View = System.Windows.Forms.View.Details;
            // 
            // id
            // 
            this.id.Text = "id";
            this.id.Width = 0;
            // 
            // col_fornecedor
            // 
            this.col_fornecedor.Text = "Fornecedor";
            this.col_fornecedor.Width = 65;
            // 
            // col_nome_prod
            // 
            this.col_nome_prod.Text = "Nome produto";
            // 
            // col_cat_prod
            // 
            this.col_cat_prod.Text = "Cat.Produto";
            this.col_cat_prod.Width = 50;
            // 
            // col_p_compra
            // 
            this.col_p_compra.Text = "Preço_C";
            this.col_p_compra.Width = 55;
            // 
            // col_Data_C
            // 
            this.col_Data_C.Text = "Data";
            this.col_Data_C.Width = 55;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(12, 19);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(21, 15);
            this.label4.TabIndex = 21;
            this.label4.Text = "De";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(419, 19);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(25, 15);
            this.label5.TabIndex = 22;
            this.label5.Text = "Até";
            // 
            // listView2
            // 
            this.listView2.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.col_id,
            this.col_Nome_Prod_V,
            this.col_Cli,
            this.col_Cat_P,
            this.col_P_V,
            col_Qaunt_V,
            this.col_Data_V,
            this.col_Func_V});
            this.listView2.FullRowSelect = true;
            this.listView2.Location = new System.Drawing.Point(419, 130);
            this.listView2.Name = "listView2";
            this.listView2.Size = new System.Drawing.Size(369, 218);
            this.listView2.TabIndex = 23;
            this.listView2.UseCompatibleStateImageBehavior = false;
            this.listView2.View = System.Windows.Forms.View.Details;
            // 
            // col_id
            // 
            this.col_id.Text = "id";
            this.col_id.Width = 0;
            // 
            // col_Nome_Prod_V
            // 
            this.col_Nome_Prod_V.Text = "Nome";
            // 
            // col_Cli
            // 
            this.col_Cli.Text = "Cliente";
            // 
            // col_Cat_P
            // 
            this.col_Cat_P.Text = "Categoria";
            // 
            // col_P_V
            // 
            this.col_P_V.Text = "Preço_V";
            this.col_P_V.Width = 55;
            // 
            // col_Data_V
            // 
            this.col_Data_V.Text = "Data";
            this.col_Data_V.Width = 55;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(12, 112);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(55, 15);
            this.label6.TabIndex = 24;
            this.label6.Text = "Compras";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(419, 112);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(44, 15);
            this.label7.TabIndex = 25;
            this.label7.Text = "Vendas";
            // 
            // buttonEdit
            // 
            this.buttonEdit.Enabled = false;
            this.buttonEdit.Location = new System.Drawing.Point(419, 396);
            this.buttonEdit.Name = "buttonEdit";
            this.buttonEdit.Size = new System.Drawing.Size(369, 23);
            this.buttonEdit.TabIndex = 26;
            this.buttonEdit.Text = "Salvar Alterações";
            this.buttonEdit.UseVisualStyleBackColor = true;
            // 
            // buttonBack
            // 
            this.buttonBack.Location = new System.Drawing.Point(419, 449);
            this.buttonBack.Name = "buttonBack";
            this.buttonBack.Size = new System.Drawing.Size(369, 23);
            this.buttonBack.TabIndex = 27;
            this.buttonBack.Text = "Voltar";
            this.buttonBack.UseVisualStyleBackColor = true;
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(12, 378);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(85, 15);
            this.label8.TabIndex = 28;
            this.label8.Text = "Receita vendas";
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(120, 378);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(83, 15);
            this.label9.TabIndex = 29;
            this.label9.Text = "Invest Estoque";
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(12, 422);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(80, 15);
            this.label10.TabIndex = 30;
            this.label10.Text = "Quant vendas";
            // 
            // textValorVendas
            // 
            this.textValorVendas.Location = new System.Drawing.Point(12, 396);
            this.textValorVendas.Name = "textValorVendas";
            this.textValorVendas.PlaceholderText = "R$ 0,00";
            this.textValorVendas.Size = new System.Drawing.Size(100, 23);
            this.textValorVendas.TabIndex = 31;
            // 
            // textQuantV
            // 
            this.textQuantV.Location = new System.Drawing.Point(13, 440);
            this.textQuantV.Name = "textQuantV";
            this.textQuantV.PlaceholderText = "0";
            this.textQuantV.Size = new System.Drawing.Size(100, 23);
            this.textQuantV.TabIndex = 32;
            // 
            // textValorInvestimento
            // 
            this.textValorInvestimento.Enabled = false;
            this.textValorInvestimento.Location = new System.Drawing.Point(120, 396);
            this.textValorInvestimento.Name = "textValorInvestimento";
            this.textValorInvestimento.PlaceholderText = "R$ 0,00";
            this.textValorInvestimento.Size = new System.Drawing.Size(100, 23);
            this.textValorInvestimento.TabIndex = 33;
            // 
            // textQuantC
            // 
            this.textQuantC.Enabled = false;
            this.textQuantC.Location = new System.Drawing.Point(120, 440);
            this.textQuantC.Name = "textQuantC";
            this.textQuantC.PlaceholderText = "0";
            this.textQuantC.Size = new System.Drawing.Size(100, 23);
            this.textQuantC.TabIndex = 35;
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(119, 422);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(89, 15);
            this.label11.TabIndex = 34;
            this.label11.Text = "Quant compras";
            // 
            // textLucro
            // 
            this.textLucro.Enabled = false;
            this.textLucro.Location = new System.Drawing.Point(281, 396);
            this.textLucro.Name = "textLucro";
            this.textLucro.PlaceholderText = "R$ 0,00";
            this.textLucro.Size = new System.Drawing.Size(100, 23);
            this.textLucro.TabIndex = 36;
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(281, 378);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(37, 15);
            this.label12.TabIndex = 37;
            this.label12.Text = "Lucro";
            // 
            // buttonDelet
            // 
            this.buttonDelet.Location = new System.Drawing.Point(419, 422);
            this.buttonDelet.Name = "buttonDelet";
            this.buttonDelet.Size = new System.Drawing.Size(369, 23);
            this.buttonDelet.TabIndex = 38;
            this.buttonDelet.Text = "Deletar";
            this.buttonDelet.UseVisualStyleBackColor = true;
            // 
            // col_Func_V
            // 
            this.col_Func_V.Text = "Funcionario";
            // 
            // col_Func_C
            // 
            this.col_Func_C.Text = "Funcionario";
            // 
            // Balanço
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 488);
            this.Controls.Add(this.buttonDelet);
            this.Controls.Add(this.label12);
            this.Controls.Add(this.textLucro);
            this.Controls.Add(this.textQuantC);
            this.Controls.Add(this.label11);
            this.Controls.Add(this.textValorInvestimento);
            this.Controls.Add(this.textQuantV);
            this.Controls.Add(this.textValorVendas);
            this.Controls.Add(this.label10);
            this.Controls.Add(this.label9);
            this.Controls.Add(this.label8);
            this.Controls.Add(this.buttonBack);
            this.Controls.Add(this.buttonEdit);
            this.Controls.Add(this.label7);
            this.Controls.Add(this.label6);
            this.Controls.Add(this.listView2);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.listView1);
            this.Controls.Add(this.dateTimePicker2);
            this.Controls.Add(this.dateTimePicker1);
            this.Name = "Balanço";
            this.Text = "Form6";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private DateTimePicker dateTimePicker1;
        private DateTimePicker dateTimePicker2;
        private ListView listView1;
        private ColumnHeader id;
        private ColumnHeader col_fornecedor;
        private ColumnHeader col_nome_prod;
        private ColumnHeader col_cat_prod;
        private ColumnHeader col_p_compra;
        private ColumnHeader col_Data_C;
        private Label label4;
        private Label label5;
        private ListView listView2;
        private ColumnHeader col_id;
        private ColumnHeader col_Nome_Prod_V;
        private ColumnHeader col_Cli;
        private ColumnHeader col_Cat_P;
        private ColumnHeader col_P_V;
        private ColumnHeader col_Data_V;
        private Label label6;
        private Label label7;
        private Button buttonEdit;
        private Button buttonBack;
        private Label label8;
        private Label label9;
        private Label label10;
        private TextBox textValorVendas;
        private TextBox textQuantV;
        private TextBox textValorInvestimento;
        private TextBox textQuantC;
        private Label label11;
        private TextBox textLucro;
        private Label label12;
        private Button buttonDelet;
        private ColumnHeader col_Func_C;
        public ColumnHeader col_Func_V;
    }
}